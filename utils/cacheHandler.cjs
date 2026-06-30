/* eslint-disable @typescript-eslint/no-require-imports */
// utils/cacheHandler.cjs
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

// Local memory mapping fallback to store transient layout configurations safely
const componentCacheMap = new Map();

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
    // Tier 1: Isolate compilation layout frames to local memory
    if (key.includes("[") || key.includes("]")) {
      return componentCacheMap.get(key) || undefined;
    }

    const bucket = process.env.CACHE_BUCKET_NAME;
    const buildId = process.env.NEXT_BUILD_ID || "default-build";
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

      // Protect against structural map destruction
      if (
        cacheEntry?.value?.segmentData &&
        !(cacheEntry.value.segmentData instanceof Map)
      ) {
        return undefined;
      }

      return cacheEntry;
    } catch (error) {
      if (componentCacheMap.has(key)) {
        return componentCacheMap.get(key);
      }
      return undefined;
    }
  }

  async set(key, value, ctx) {
    // Keep internal memory aligned to protect quick execution ticks
    componentCacheMap.set(key, value);

    if (key.includes("[") || key.includes("]")) {
      return;
    }

    const bucket = process.env.CACHE_BUCKET_NAME;
    const buildId = process.env.NEXT_BUILD_ID || "default-build";
    if (!bucket || !value) return;

    if (
      value?.value?.segmentData &&
      !(value.value.segmentData instanceof Map)
    ) {
      return;
    }

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
      console.error("[CacheComponents] S3 Write Failure:", error.message);
    }
  }

  async revalidateTag(tag) {
    return;
  }
};
