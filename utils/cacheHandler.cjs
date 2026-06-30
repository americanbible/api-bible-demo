/* eslint-disable @typescript-eslint/no-require-imports */
// utils/cacheHandler.cjs
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const v8 = require("node:v8");

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

    // 1. 👈 CRITICAL: Never pull internal structural templates from S3
    if (!bucket || key.includes("[") || key.includes("]")) {
      return undefined;
    }

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

      const cacheEntry = v8.deserialize(buffer);

      // 2. Structural integrity fallback: Ensure maps are healthy
      if (
        cacheEntry?.value?.segmentData &&
        !(cacheEntry.value.segmentData instanceof Map)
      ) {
        console.warn(
          `[CacheHandler] Rejected malformed segmentData Map for key: ${key}`,
        );
        return undefined;
      }

      return cacheEntry;
    } catch (error) {
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

    // 3. 👈 CRITICAL: Prevent Next.js from saving structural templates into S3
    if (!bucket || !value || key.includes("[") || key.includes("]")) {
      return;
    }

    // 4. Defensive Guard: Never upload a corrupted flat layout map to your bucket
    if (
      value?.value?.segmentData &&
      !(value.value.segmentData instanceof Map)
    ) {
      return;
    }

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
