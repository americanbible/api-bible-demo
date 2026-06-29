/* eslint-disable @typescript-eslint/no-require-imports */
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.CACHE_BUCKET_NAME;
const BUILD_ID = process.env.NEXT_BUILD_ID || "default-build";

// Global, in-memory fallback to satisfy Next.js during local compilation/amplify builds
const localMemoryCache = new Map();

function jsonReplacer(key, value) {
  if (value instanceof Map) {
    return { __type: "Map", value: Array.from(value.entries()) };
  }
  return value;
}

function jsonReviver(key, value) {
  if (value && typeof value === "object" && value.__type === "Map") {
    return new Map(value.value);
  }
  return value;
}

class CacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    // Fall back to memory build cache if S3 environment variables aren't injected yet
    if (!BUCKET_NAME) {
      return localMemoryCache.get(key) || undefined;
    }

    const s3Key = `${BUILD_ID}/${key}`;
    try {
      const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key });
      const response = await s3.send(command);
      const dataStr = await response.Body.transformToString();

      return JSON.parse(dataStr, jsonReviver);
    } catch (error) {
      // Check local memory first on S3 miss to prevent cold-start crashes
      if (localMemoryCache.has(key)) return localMemoryCache.get(key);
      return undefined;
    }
  }

  async set(key, value, ctx) {
    // Always store locally first so Next.js build step succeeds
    localMemoryCache.set(key, value);

    if (!BUCKET_NAME) return;

    const s3Key = `${BUILD_ID}/${key}`;
    try {
      const serializedData = JSON.stringify(value, jsonReplacer);
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: serializedData,
          ContentType: "application/json",
        }),
      );
    } catch (error) {
      console.error("S3 Cache Set Error:", error);
    }
  }

  async revalidateTag(tag) {
    return;
  }
}

// 👈 ABSOLUTE REQUIREMENT: Must be direct assignment, no wrapping object!
module.exports = CacheHandler;
