/* eslint-disable @typescript-eslint/no-require-imports */
// utils/cacheHandler.cjs
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const v8 = require("node:v8");

// An active global memory map to fulfill Next.js's abstract compilation layout frames
const localMemoryStore = new Map();

class CacheHandler {
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

    // 1. TIER 1 (Compilation Shells): If Next.js asks for a literal template string path,
    // fetch it from memory to preserve structural map integrity during the build phase.
    if (key.includes("[") || key.includes("]")) {
      return localMemoryStore.get(key) || undefined;
    }

    if (!bucket) return undefined;

    const s3Key = `${buildId}/${key}`;
    try {
      const s3 = this.getS3();
      const command = new GetObjectCommand({ Bucket: bucket, Key: s3Key });
      const response = await s3.send(command);

      const uint8Array = await response.Body.transformToByteArray();
      const buffer = Buffer.from(
        uint8Array.buffer,
        uint8Array.byteOffset,
        uint8Array.byteLength,
      );

      // Restore full binary states (including nested maps & buffers) exactly as Next expects
      const cacheEntry = v8.deserialize(buffer);

      // Validation safety net
      if (
        cacheEntry?.value?.segmentData &&
        !(cacheEntry.value.segmentData instanceof Map)
      ) {
        return undefined;
      }

      return cacheEntry;
    } catch (error) {
      // On an S3 miss, fall back to check if it exists in local memory as a backup
      if (localMemoryStore.has(key)) {
        return localMemoryStore.get(key);
      }
      if (
        error.name === "NoSuchKey" ||
        error.name === "AccessDenied" ||
        error.name === "TypeError"
      ) {
        return undefined;
      }
      console.error("[CacheHandler] S3 API Read Error:", error.message);
      return undefined;
    }
  }

  async set(key, value, ctx) {
    const bucket = process.env.CACHE_BUCKET_NAME;
    const buildId = process.env.NEXT_BUILD_ID || "default-build";

    if (!value) return;

    // 2. ALWAYS seed local memory first. This prevents Next.js from falling back
    // to a raw, flattened layout object during immediate processing loops.
    localMemoryStore.set(key, value);

    // 3. TIER 1 (Compilation Shells): Do not send abstract path tokens to S3.
    if (key.includes("[") || key.includes("]")) {
      return;
    }

    // Defensive check: Do not upload corrupt shapes to persistent storage
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
      const binaryPayload = v8.serialize(value);

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: s3Key,
          Body: binaryPayload,
          ContentType: "application/octet-stream",
        }),
      );
    } catch (error) {
      console.error("[CacheHandler] S3 API Write Error:", error.message);
    }
  }

  async revalidateTag(tag) {
    return;
  }
}

module.exports = CacheHandler;
