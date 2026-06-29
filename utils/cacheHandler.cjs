/* eslint-disable @typescript-eslint/no-require-imports */
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

// Initialize S3 Client
const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.CACHE_BUCKET_NAME;
const BUILD_ID = process.env.NEXT_BUILD_ID || "default-build";

// Map Replacer/Reviver Pattern to keep P.get() working
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

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    // 1. Next.js needs undefined if caching isn't ready/enabled yet
    if (!BUCKET_NAME) return undefined;

    const s3Key = `${BUILD_ID}/${key}`;
    try {
      const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key });
      const response = await s3.send(command);

      const dataStr = await response.Body.transformToString();
      const cacheEntry = JSON.parse(dataStr, jsonReviver);

      // Validate data health defensively
      if (
        cacheEntry?.value?.segmentData &&
        !(cacheEntry.value.segmentData instanceof Map)
      ) {
        return undefined;
      }

      // 2. Return undefined if nothing was actually parsed
      return cacheEntry || undefined;
    } catch (error) {
      // 3. CRITICAL: S3 cache miss MUST return undefined, not null
      if (error.name === "NoSuchKey" || error.name === "AccessDenied") {
        return undefined;
      }
      console.error("S3 Cache Get Error:", error);
      return undefined;
    }
  }

  async set(key, value, ctx) {
    if (!BUCKET_NAME) return;
    const s3Key = `${BUILD_ID}/${key}`;

    try {
      const serializedData = JSON.stringify(value, jsonReplacer);
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: serializedData,
        ContentType: "application/json",
      });

      await s3.send(command);
    } catch (error) {
      console.error("S3 Cache Set Error:", error);
    }
  }

  // 4. MANDATORY METHOD: Next.js crashes during build if this is missing
  async revalidateTag(tag) {
    // If you aren't storing tags yet, leaving this as a no-op
    // satisfies the Next.js compiler interface requirements.
    return;
  }
};
