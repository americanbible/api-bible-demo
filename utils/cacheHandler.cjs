/* eslint-disable @typescript-eslint/no-require-imports */
// utils/cacheHandler.cjs
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const BUCKET_NAME = process.env.CACHE_BUCKET_NAME;
const BUILD_ID = process.env.NEXT_BUILD_ID || "default-build";

// Deeply ensure that no object can ever be returned to Next.js without a working .get() method
function patchCacheEntry(entry) {
  if (!entry || typeof entry !== "object") return entry;

  // 1. Target the underlying page value layer
  if (entry.value && typeof entry.value === "object") {
    const val = entry.value;

    // 2. Next.js 14.2+ / 15+ stores segmentData and rscData here
    if (val.segmentData && !(val.segmentData instanceof Map)) {
      if (typeof val.segmentData === "object" && !val.segmentData.get) {
        // Hijack the plain object and give it an inline Map-compatible getter
        val.segmentData.get = function (key) {
          return this[key] || undefined;
        };
        val.segmentData.set = function (key, value) {
          this[key] = value;
          return this;
        };
        val.segmentData.has = function (key) {
          return key in this;
        };
      }
    }
  }
  return entry;
}

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
    if (!BUCKET_NAME) return undefined;

    const s3Key = `${BUILD_ID}/${key}`;
    try {
      const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key });
      const response = await s3.send(command);
      const dataStr = await response.Body.transformToString();
      const cacheEntry = JSON.parse(dataStr, jsonReviver);

      // Protect against read-corruptions from S3
      return patchCacheEntry(cacheEntry);
    } catch (error) {
      if (error.name === "NoSuchKey" || error.name === "AccessDenied") {
        // Return a mock payload that is immune to downstream JSON conversion loops
        if (
          key.startsWith("app/") ||
          key.includes("page") ||
          key.includes("layout")
        ) {
          const freshMock = {
            lastModified: Date.now(),
            value: {
              kind: "PAGE",
              html: "",
              rsc: "",
              status: 200,
              headers: {},
              postponed: undefined,
              segmentData: new Map(),
            },
          };
          return patchCacheEntry(freshMock);
        }

        if (key.startsWith("fetch/")) {
          return {
            lastModified: Date.now(),
            value: {
              kind: "FETCH",
              data: { body: "", status: 200, headers: {} },
              tags: [],
            },
          };
        }

        return undefined;
      }
      return undefined;
    }
  }

  async set(key, value, ctx) {
    if (!BUCKET_NAME) return;

    // Intercept Next.js's flattened objects before uploading to S3
    const sanitizedValue = patchCacheEntry(value);

    const s3Key = `${BUILD_ID}/${key}`;
    try {
      const serializedData = JSON.stringify(sanitizedValue, jsonReplacer);
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
};
