import { Bible } from "@americanbible/api-bible-sdk";
import { notFound } from "next/navigation";
import { client } from "./api";
import { demoBibles } from "./demoBibles";

let demoBiblesRequest: Promise<Bible[]> | null = null;

/**
 * Returns a demo Bible's details, such as its name and abbreviation for page headers.
 *
 * Every page needs these details, but they rarely change. Rather than calling the
 * `/bibles/{bibleId}` endpoint on every page render, all demo Bibles are fetched once
 * with a single call to the `/bibles` endpoint and kept in memory for the life of the
 * server. A failed request isn't kept, so the next render tries again.
 */
export async function getDemoBible(bibleId: string): Promise<Bible> {
  //Fetch all demo bibles from the `/bibles` endpoint, once per server
  demoBiblesRequest ??= client.bibles
    .list({ ids: demoBibles })
    .then(({ data }) => data)
    .catch((error) => {
      demoBiblesRequest = null;
      throw error;
    });

  const bible = (await demoBiblesRequest).find(({ id }) => id === bibleId);
  if (!bible) {
    notFound();
  }

  return bible;
}
