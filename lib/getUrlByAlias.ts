import getCollection, { URLS_COLLECTION } from "@/db";
import type { ShortUrl } from "@/types";

export async function getUrlByAlias(
  alias: string
): Promise<ShortUrl | null> {
  const collection = await getCollection(URLS_COLLECTION);

  const doc = await collection.findOne({ alias });

  if (!doc) return null;

  return doc as unknown as ShortUrl;
}
