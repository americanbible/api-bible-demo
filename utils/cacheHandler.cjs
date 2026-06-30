/* eslint-disable @typescript-eslint/no-require-imports */
// utils/cacheHandler.cjs
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

// An active, isolated memory layer to protect internal Next.js compilation layout frames
const localMemoryStore = new Map();

/**
 * Modern Custom Replacer
 * Preserves structural Maps and binary Buffers into safe text mappings
 */
function customReplacer(key, value) {
  if (value instanceof Map) {
    return { __type: "Map", value: Array.from(value.entries()) };
  }
  if (value && value.type === "Buffer" && Array.isArray(value.data)) {
    return { __type: "Buffer", value: value.data };
  }
  if (Buffer.isBuffer(value)) {
    return { __type: "Buffer", value: Array.from(value) };
  }
  return value;
}

/**
 * Deep Custom Reviver
 * Fully maps authentic Map and Buffer instances back to the framework
 */
function customDeserializer(key, value) {
  if (value && typeof value === "object") {
    if (value.__type === "Map") {
      return new Map(
        value.value.map(([k, v]) => [k, customDeserializer(null, v)]),
      );
    }
    if (value.__type === "Buffer") {
      return Buffer.from(value.value);
    }
  }
  return value;
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

    // Tier 1: If Next.js asks for abstract code components, isolate it to local memory
    if (key.includes("[") || key.includes("]")) {
      return localMemoryStore.get(key) || undefined;
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

      const cacheEntry = JSON.parse(dataStr, customDeserializer);

      // Deep type validation safety net to catch corrupt shapes
      if (
        cacheEntry?.value?.segmentData &&
        !(cacheEntry.value.segmentData instanceof Map)
      ) {
        return undefined;
      }

      return cacheEntry;
    } catch (error) {
      // 🌟 THE INVARIANT & P.GET RECONCILIATION FALLBACK:
      // If S3 doesn't have the entry yet, we MUST return a structure that contains
      // an active Map for segmentData, but whose layout metadata properties are empty.
      // This tells the invariant engine that the payload envelope is safe to parse,
      // while signaling a complete cache miss so Next.js generates the page from scratch.
      if (
        error.name === "NoSuchKey" ||
        error.name === "AccessDenied" ||
        error.name === "TypeError"
      ) {
        if (
          key.startsWith("app/") ||
          key.includes("page") ||
          key.includes("layout")
        ) {
          return {
            lastModified: Date.now(),
            value: {
              kind: "PAGE",
              html: null, // Forces a safe page layout fallback regeneration loop
              rsc: null, // Clears the dual parallel invariant check
              status: 200,
              headers: {},
              segmentData: new Map(), // Explicitly stops the initial P.get crash loop!
            },
          };
        }

        // Return local memory snapshot fallback if available
        if (localMemoryStore.has(key)) {
          return localMemoryStore.get(key);
        }
      }
      return undefined;
    }
  }

  async set(key, value, ctx) {
    const bucket = process.env.CACHE_BUCKET_NAME;
    const buildId = process.env.NEXT_BUILD_ID || "default-build";

    if (!value) return;

    // Update memory cache immediately to protect immediate page compilation passes
    localMemoryStore.set(key, value);

    if (key.includes("[") || key.includes("]")) {
      return;
    }

    // Block malformed plain objects from uploading to the bucket
    if (
      value?.value?.segmentData &&
      !(value.value.segmentData instanceof Map)
    ) {
      return;
    }

    if (!bucket) return;

    const s3Key = `${buildId}/${key}`;
    try {
      const s3 = this.getS3();
      const serializedData = JSON.stringify(value, customReplacer);

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: s3Key,
          Body: serializedData,
          ContentType: "application/json",
        }),
      );
    } catch (error) {
      console.error("[CacheHandler] S3 Write Error:", error.message);
    }
  }

  async revalidateTag(tag) {
    return;
  }
};
