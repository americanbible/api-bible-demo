/* eslint-disable @typescript-eslint/no-require-imports */
// utils/cacheHandler.cjs
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

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

    // 1. 👈 CRITICAL: Skip any legacy page routing paths or abstract code frames.
    // Component Caching keys are always pure alphanumeric cryptographic hashes.
    if (
      !bucket ||
      key.includes("/") ||
      key.includes("[") ||
      key.includes("]")
    ) {
      return undefined;
    }

    const s3Key = `${buildId}/${key}.json`;
    try {
      const s3 = this.getS3();
      const command = new GetObjectCommand({ Bucket: bucket, Key: s3Key });
      const response = await s3.send(command);
      const dataStr = await response.Body.transformToString();

      if (!dataStr || dataStr === "undefined" || dataStr === "null") {
        return undefined;
      }

      return JSON.parse(dataStr);
    } catch (error) {
      // Return a clean undefined on S3 miss to let Next.js generate the component fresh
      if (
        error.name === "NoSuchKey" ||
        error.name === "AccessDenied" ||
        error.name === "TypeError"
      ) {
        return undefined;
      }
      console.error("[ComponentCache] S3 Read Exception:", error.message);
      return undefined;
    }
  }

  async set(key, value, ctx) {
    const bucket = process.env.CACHE_BUCKET_NAME;
    const buildId = process.env.NEXT_BUILD_ID || "default-build";

    // 2. 👈 CRITICAL: Never write page-level structural wrappers to S3
    if (
      !bucket ||
      !value ||
      key.includes("/") ||
      key.includes("[") ||
      key.includes("]")
    ) {
      return;
    }

    const s3Key = `${buildId}/${key}.json`;
    try {
      const s3 = this.getS3();
      const serializedData = JSON.stringify(value);

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: s3Key,
          Body: serializedData,
          ContentType: "application/json",
        }),
      );
    } catch (error) {
      console.error("[ComponentCache] S3 Write Exception:", error.message);
    }
  }

  async revalidateTag(tag) {
    return;
  }
}

module.exports = CacheHandler;
