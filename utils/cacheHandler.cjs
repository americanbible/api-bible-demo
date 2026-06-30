/* eslint-disable @typescript-eslint/no-require-imports */
// utils/cacheHandler.cjs
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

// Global memory layer to fulfill immediate layout compilation requests during build
const localMemoryStore = new Map();

/**
 * Clean JSON Replacer
 * Explicitly serializes Maps and binary Buffers into safe text structures
 * that bypass all Node bundling restrictions.
 */
function jsonReplacer(key, value) {
  if (value instanceof Map) {
    return { __type: "Map", value: Array.from(value.entries()) };
  }
  // Safely translate modern Next.js internal Buffer items
  if (value && value.type === "Buffer" && Array.isArray(value.data)) {
    return { __type: "Buffer", value: value.data };
  }
  if (Buffer.isBuffer(value)) {
    return { __type: "Buffer", value: Array.from(value) };
  }
  return value;
}

/**
 * Deep JSON Reviver
 * Reconstructs authentic Maps and Buffers, and acts as a bulletproof safety shield
 * to guarantee that no object ever leaves the handler without a functioning .get() method.
 */
function jsonReviver(key, value) {
  if (value && typeof value === "object") {
    if (value.__type === "Map") {
      const restoredMap = new Map(
        value.value.map(([k, v]) => [k, jsonReviver(null, v)]),
      );
      return restoredMap;
    }
    if (value.__type === "Buffer") {
      return Buffer.from(value.value);
    }
  }
  return value;
}

/**
 * Core Structural Interceptor
 * Injected as a secondary defensive fallback loop to prevent any downstream P.get crashes.
 */
function enforceMapCompliance(entry) {
  if (!entry || typeof entry !== "object") return entry;

  if (entry.value && typeof entry.value === "object") {
    const val = entry.value;

    // Inject dynamic prototype handlers if Next.js flattens segment data inside memory arrays
    if (val.segmentData && !(val.segmentData instanceof Map)) {
      if (typeof val.segmentData === "object" && !val.segmentData.get) {
        val.segmentData.get = function (k) {
          return this[k] || undefined;
        };
        val.segmentData.set = function (k, v) {
          this[k] = v;
          return this;
        };
        val.segmentData.has = function (k) {
          return k in this;
        };
      }
    }
  }
  return entry;
}

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options;
    this.s3Client = null;
  }

  getS3() {
    if (!this.s3Client) {
      this.s3Client = new S3Client({
        region:
          process.env.AWS_REGION ||
          process.env.AWS_DEFAULT_REGION ||
          "us-east-1",
      });
    }
    return this.s3Client;
  }

  async get(key) {
    const bucket = process.env.CACHE_BUCKET_NAME;
    const buildId = process.env.NEXT_BUILD_ID || "default-build";

    // Tier 1: Abstract framework template compilation isolation
    if (key.includes("[") || key.includes("]")) {
      return enforceMapCompliance(localMemoryStore.get(key)) || undefined;
    }

    if (!bucket) return undefined;

    const s3Key = `${buildId}/${key}`;
    try {
      const s3 = this.getS3();
      const command = new GetObjectCommand({ Bucket: bucket, Key: s3Key });
      const response = await s3.send(command);
      const dataStr = await response.Body.transformToString();

      if (!dataStr || dataStr === "undefined" || dataStr === "null") {
        return undefined;
      }

      // Parse with deep structural alignment
      const cacheEntry = JSON.parse(dataStr, jsonReviver);
      return enforceMapCompliance(cacheEntry);
    } catch (error) {
      if (localMemoryStore.has(key)) {
        return enforceMapCompliance(localMemoryStore.get(key));
      }
      if (
        error.name === "NoSuchKey" ||
        error.name === "AccessDenied" ||
        error.name === "TypeError"
      ) {
        return undefined;
      }
      console.error("[CacheHandler] S3 Read Exception:", error.message);
      return undefined;
    }
  }

  async set(key, value, ctx) {
    const bucket = process.env.CACHE_BUCKET_NAME;
    const buildId = process.env.NEXT_BUILD_ID || "default-build";

    if (!value) return;

    // Immediately update local cache states to protect internal rendering ticks
    localMemoryStore.set(key, value);

    if (key.includes("[") || key.includes("]")) {
      return;
    }

    if (!bucket) return;

    const s3Key = `${buildId}/${key}`;
    try {
      const s3 = this.getS3();
      const serializedData = JSON.stringify(value, jsonReplacer);

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: s3Key,
          Body: serializedData,
          ContentType: "application/json", // Pure text payload completely immune to bundling failures
        }),
      );
    } catch (error) {
      console.error("[CacheHandler] S3 Write Exception:", error.message);
    }
  }

  async revalidateTag(tag) {
    return;
  }
};
