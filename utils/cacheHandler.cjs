/* eslint-disable @typescript-eslint/no-require-imports */
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const BUCKET_NAME = process.env.CACHE_BUCKET_NAME;
const BUILD_ID = process.env.NEXT_BUILD_ID || "default-build";

/**
 * Custom Serialization Replacer
 * Deep-scans Next.js payloads to preserve binary Buffers and Maps
 * before uploading raw JSON strings to S3
 */
function customSerializer(key, value) {
  if (value instanceof Map) {
    return { __type: "Map", value: Array.from(value.entries()) };
  }
  // If Next.js has attached an internal buffer (like rscData or segment chunks)
  if (value && value.type === "Buffer" && Array.isArray(value.data)) {
    return { __type: "Buffer", value: value.data };
  }
  if (Buffer.isBuffer(value)) {
    return { __type: "Buffer", value: Array.from(value) };
  }
  return value;
}

/**
 * Custom Deserialization Reviver
 * Fully reconstructs Maps and Buffers so Next.js internals can call P.get() smoothly
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
  }

  async get(key) {
    if (!BUCKET_NAME) return undefined;

    const s3Key = `${BUILD_ID}/${key}`;
    try {
      const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key });
      const response = await s3.send(command);
      const dataStr = await response.Body.transformToString();

      // Parse using our deep-structural reviver
      const cacheEntry = JSON.parse(dataStr, customDeserializer);

      // Validate signature safety net
      if (
        cacheEntry?.value?.segmentData &&
        !(cacheEntry.value.segmentData instanceof Map)
      ) {
        return undefined;
      }

      return cacheEntry || undefined;
    } catch (error) {
      if (error.name === "NoSuchKey" || error.name === "AccessDenied") {
        // Return standard structural undefined on a miss to trigger dynamic page generation
        return undefined;
      }
      console.error("S3 Cache Get Error:", error);
      return undefined;
    }
  }

  async set(key, value, ctx) {
    if (!BUCKET_NAME) return;

    const s3Key = `${BUILD_ID}/${key}`;
    try {
      // Serialize preserving structural integrity
      const serializedData = JSON.stringify(value, customSerializer);

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
