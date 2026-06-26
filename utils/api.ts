import { createBibleClient } from "@americanbible/api-bible-sdk";

export const client = createBibleClient({
  apiKey: process.env.API_BIBLE_API_KEY!,
});
