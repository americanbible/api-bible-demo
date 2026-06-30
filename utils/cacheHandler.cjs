/* eslint-disable @typescript-eslint/no-require-imports */
// utils/cacheHandler.cjs
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const v8 = require("node:v8"); // 👈 Native Node module to accurately preserve Maps and Buffers

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

    if (!bucket) return undefined;

    try {
      const s3 = this.getS3();
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: `${buildId}/${key}`,
      });
      const response = await s3.send(command);

      // 1. Convert S3 stream straight into a raw Byte Array
      const uint8Array = await response.Body.transformToByteArray();

      // 2. Wrap it cleanly in a Node.js Buffer
      const buffer = Buffer.from(
        uint8Array.buffer,
        uint8Array.byteOffset,
        uint8Array.byteLength,
      );

      // 3. Reconstruct the precise V8 memory state (restoring Maps and nested Buffers perfectly)
      return v8.deserialize(buffer);
    } catch (error) {
      if (
        error.name === "NoSuchKey" ||
        error.name === "AccessDenied" ||
        error.name === "TypeError"
      ) {
        return undefined; // Hand control back to Next.js safely on cache miss
      }
      console.error("[CacheHandler] S3 API Read Error:", error.message);
      return undefined;
    }
  }

  async set(key, value, ctx) {
    const bucket = process.env.CACHE_BUCKET_NAME;
    const buildId = process.env.NEXT_BUILD_ID || "default-build";

    if (!bucket || !value) return;

    try {
      const s3 = this.getS3();

      // 1. Serialize the actual value instance into raw V8 binary bytes
      const binaryPayload = v8.serialize(value);

      // 2. Upload directly to S3 as binary data
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: `${buildId}/${key}`,
          Body: binaryPayload, // S3 accepts Buffers natively
          ContentType: "application/octet-stream", // Informs AWS this is binary data
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
