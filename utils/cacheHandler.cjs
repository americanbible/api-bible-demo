/* eslint-disable @typescript-eslint/no-require-imports */
// utils/cacheHandler.cjs
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

// An active global memory map to fulfill Next.js's internal component layout shells
const localMemoryStore = new Map();

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
    // 1. TIER 1 SAFETY NET: If Next.js asks for abstract component paths during PPR assembly,
    // handle it natively via memory to protect complex React structures from destruction.
    if (key.includes("[") || key.includes("]")) {
      return localMemoryStore.get(key) || undefined;
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

      // Verify that structural segment mapping metadata wasn't flattened
      if (
        cacheEntry?.value?.segmentData &&
        !(cacheEntry.value.segmentData instanceof Map)
      ) {
        return undefined;
      }

      return cacheEntry;
    } catch (error) {
      // Fallback check if component generation exists locally
      if (localMemoryStore.has(key)) {
        return localMemoryStore.get(key);
      }
      return undefined;
    }
  }

  async set(key, value, ctx) {
    // 2. Seed memory store instantly so React can read components within the same rendering frame
    localMemoryStore.set(key, value);

    if (key.includes("[") || key.includes("]")) {
      return;
    }

    const bucket = process.env.CACHE_BUCKET_NAME;
    const buildId = process.env.NEXT_BUILD_ID || "default-build";
    if (!bucket || !value) return;

    // Block saving corrupted flat objects into component scopes
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
      console.error(
        "[CacheComponents Handler] S3 Write Exception:",
        error.message,
      );
    }
  }

  async revalidateTag(tag) {
    return;
  }
};
