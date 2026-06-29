/* eslint-disable @typescript-eslint/no-require-imports */
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const v8 = require("node:v8");

function jsonReplacer(key, value) {
  if (value instanceof Map) {
    return { __type: "Map", value: Array.from(value.entries()) };
  }
  return value;
}

function jsonReviver(key, value) {
  if (value && typeof value === "object" && value.__type === "Map") {
    return new Map(value.value);
  }
  return value;
}

const s3 = new S3Client();
const BUCKET_NAME = process.env.NEXTJS_CACHE_BUCKET_NAME;
const BUILD_ID = process.env.NEXT_BUILD_ID || "default"; // Prevents cache collisions between builds

class S3CacheHandler {
  constructor(options) {
    this.options = options;
  }

  // Next.js calls get() to retrieve the cached component state
  async get(key) {
    if (!BUCKET_NAME) {
      return null;
    }

    const s3Key = `${BUILD_ID}/${key}`;
    try {
      const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key });
      const response = await s3.send(command);

      // const buffer = Buffer.from(await response.Body.transformToByteArray());
      // return v8.deserialize(buffer);

      const dataStr = await response.Body.transformToString();
      const cacheEntry = JSON.parse(dataStr, jsonReviver);
      if (
        cacheEntry?.value?.segmentData &&
        !(cacheEntry.value.segmentData instanceof Map)
      ) {
        console.warn(
          `[Cache Safety] segmentData for ${key} is flat. Forcing fallback.`,
        );
        return null;
      }

      return cacheEntry;
    } catch (error) {
      if (error.name === "NoSuchKey" || error.name === "AccessDenied") {
        return null;
      }
      console.error("S3 Cache Get Error:", error);
      return null;
    }
  }

  // Next.js calls set() to store the "use cache" component payload
  async set(key, entry) {
    if (!BUCKET_NAME) {
      return;
    }

    const s3Key = `${BUILD_ID}/${key}`;
    try {
      // Modern cache components pass entry value or stream payloads
      let payload = entry;

      // Handle streams explicitly if present
      if (entry && typeof entry.pipe === "function") {
        payload = await this.streamToBuffer(entry);
      }

      // const buffer = v8.serialize(payload);

      // const command = new PutObjectCommand({
      //   Bucket: BUCKET_NAME,
      //   Key: s3Key,
      //   Body: buffer,
      //   ContentType: "application/octet-stream",
      // });

      const serializedData = JSON.stringify(payload, jsonReplacer);

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: serializedData,
        ContentType: "application/json",
      });

      await s3.send(command);
    } catch (error) {
      console.error("S3 Cache Set Error:", error);
    }
  }

  // Helper to resolve component stream data to buffer safely
  async streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
  }
}

module.exports = S3CacheHandler;
