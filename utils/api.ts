import { createBibleClient } from "@americanbible/api-bible-sdk";

export const client = createBibleClient({
  apiKey: process.env.API_BIBLE_API_KEY!,
  //Make one attempt per request. By default the SDK makes up to 3 attempts on
  //rate limits and server errors, which multiplies calls when the API is busy.
  retry: { maxAttempts: 1 },
});
