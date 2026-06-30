/* eslint-disable @typescript-eslint/no-require-imports */
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client();
const BUCKET_NAME = process.env.CACHE_BUCKET_NAME;
const BUILD_ID = process.env.NEXT_BUILD_ID || "default"; // Prevents cache collisions between builds

module.exports = class S3CacheHandler {
  constructor(options) {
    this.options = options;
  }

  // Next.js calls get() to retrieve the cached component state
  async get(key) {
    const s3Key = `${BUILD_ID}/${key}`;
    try {
      const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key });
      const response = await s3.send(command);

      // Transform the S3 response string back into the required cache format
      const dataStr = await response.Body.transformToString();
      const cacheEntry = JSON.parse(dataStr, (k, v) => {
        if (v && typeof v === "object" && v.__type === "Map")
          return new Map(v.value);
        return v;
      });

      // Defensive check: If segmentData is missing or flattened, wipe it so Next doesn't throw a P.get error
      if (
        cacheEntry?.value?.segmentData &&
        !(cacheEntry.value.segmentData instanceof Map)
      ) {
        delete cacheEntry.value.segmentData;
      }

      return cacheEntry || undefined;
    } catch (error) {
      if (
        error.name === "NoSuchKey" ||
        error.name === "AccessDenied" ||
        error.name === "TypeError"
      ) {
        // If Next.js is requesting a page/layout shell, return a valid blank structural envelope
        if (
          key.startsWith("app/") ||
          key.includes("page") ||
          key.includes("layout")
        ) {
          return {
            lastModified: Date.now(),
            value: {
              kind: "PAGE",
              html: "",
              rsc: "",
              status: 200,
              headers: {},
              postponed: undefined,
              segmentData: new Map(), // Satisfies both the invariant contract and the P.get requirement
            },
          };
        }

        // If Next.js is requesting an internal fetch data chunk
        if (key.startsWith("fetch/")) {
          return {
            lastModified: Date.now(),
            value: {
              kind: "FETCH",
              data: { body: "", status: 200, headers: {} },
              tags: [],
            },
          };
        }
      }

      console.error("[CacheHandler] S3 API Read Error:", error.message);
      return undefined;
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

      const serializedData = JSON.stringify(payload, (k, v) => {
        if (v instanceof Map)
          return { __type: "Map", value: Array.from(v.entries()) };
        return v;
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: s3Key,
          Body: serializedData,
          ContentType: "application/json",
        }),
      );
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

  async revalidateTag() {
    return;
  }
};
