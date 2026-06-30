/* eslint-disable @typescript-eslint/no-require-imports */
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

    if (!bucket) return undefined;

    try {
      const s3 = this.getS3();
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: `${buildId}/${key}`,
      });
      const response = await s3.send(command);
      const dataStr = await response.Body.transformToString();

      // Safety net: If S3 somehow saved a bad or literal "undefined" string, treat it as a miss
      if (!dataStr || dataStr === "undefined" || dataStr === "null") {
        return undefined;
      }

      const cacheEntry = JSON.parse(dataStr, (k, v) => {
        // Correctly restore native Map properties for Next.js internal page systems
        if (v && typeof v === "object" && v.__type === "Map") {
          return new Map(v.value);
        }
        return v;
      });

      // Confirm that the parsed JSON matches the strict envelope shape Next.js requires
      if (
        cacheEntry &&
        typeof cacheEntry === "object" &&
        "value" in cacheEntry
      ) {
        return cacheEntry;
      }

      return undefined;
    } catch (error) {
      // Return a clean undefined on S3 miss. Next.js will generate the page fresh.
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

    if (!bucket) return;
    if (!value || typeof value !== "object") return;

    try {
      const s3 = this.getS3();
      const serializedData = JSON.stringify(value, (k, v) => {
        // Safely preserve Map structures before stringifying to S3
        if (value instanceof Map || v instanceof Map) {
          return { __type: "Map", value: Array.from(v.entries()) };
        }
        return v;
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: `${buildId}/${key}`,
          Body: serializedData,
          ContentType: "application/json",
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
