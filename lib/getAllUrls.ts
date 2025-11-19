import getCollection, { URLS_COLLECTION } from "@/db";
import type { ShortUrl } from "@/types";

export default async function getAllUrls(): Promise<ShortUrl[]> {
  const collection = await getCollection(URLS_COLLECTION);

  const docs = await collection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  // Mongo returns Document[], so we coerce to our type
  return docs as unknown as ShortUrl[];
}
