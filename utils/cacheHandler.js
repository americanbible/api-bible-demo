import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import v8 from "node:v8";

const s3 = new S3Client();
const BUCKET_NAME = process.env.NEXTJS_CACHE_BUCKET_NAME;
const BUILD_ID = process.env.NEXT_BUILD_ID || "default"; // Prevents cache collisions between builds

export default class S3CacheHandler {
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

      const uint8Array = await response.Body.transformToByteArray();
      const buffer = Buffer.from(
        uint8Array.buffer,
        uint8Array.byteOffset,
        uint8Array.byteLength,
      );

      return v8.deserialize(buffer);
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

      const buffer = v8.serialize(payload);

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentType: "application/octet-stream",
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
