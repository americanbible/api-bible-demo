import { uploadData, downloadData } from "aws-amplify/storage";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json" with { type: "json" };

Amplify.configure(outputs);

const BUILD_ID = process.env.NEXT_BUILD_ID || "default"; // Prevents cache collisions between builds

class S3CacheHandler {
  constructor(options) {
    this.options = options;
  }

  // Next.js calls get() to retrieve the cached component state
  async get(key) {
    return null;
    const s3Key = `${BUILD_ID}/${key}`;
    try {
      const response = await downloadData({ path: s3Key }).result;

      // Transform the S3 response string back into the required cache format
      const cacheEntry = await response.body.json();

      return cacheEntry;
    } catch (error) {
      if (error.name === "NoSuchKey") return null; // Cache miss
      console.error("S3 Cache Get Error:", error);
      return null;
    }
  }

  // Next.js calls set() to store the "use cache" component payload
  async set(key, entry) {
    const s3Key = `${BUILD_ID}/${key}`;
    try {
      // Modern cache components pass entry value or stream payloads
      let payload = entry;

      // Handle streams explicitly if present
      if (entry && typeof entry.pipe === "function") {
        payload = await this.streamToBuffer(entry);
      }

      await uploadData({
        path: s3Key,
        data: JSON.stringify(payload),
        options: { contentType: "application/json" },
      }).result;
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
