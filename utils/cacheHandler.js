import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

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

      // Transform the S3 response string back into the required cache format
      const dataStr = await response.Body.transformToString();
      const cacheEntry = JSON.parse(dataStr);

      return cacheEntry;
    } catch (error) {
      if (error.name === "NoSuchKey") return null; // Cache miss
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

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: JSON.stringify(payload),
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

export default S3CacheHandler;
