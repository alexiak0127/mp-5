"use server";

import getCollection, { URLS_COLLECTION } from "@/db";
import type { ShortUrl, CreateShortUrlResult } from "@/types";

// Syntax check only (http/https + valid URL)
function isValidUrlSyntax(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// basic alias validation (letters, numbers, dashes only)
function isValidAlias(alias: string): boolean {
  return /^[a-zA-Z0-9-]+$/.test(alias);
}

export default async function createNewUrl(
  alias: string,
  targetUrl: string
): Promise<CreateShortUrlResult> {
  const trimmedAlias = alias.trim();
  const trimmedUrl = targetUrl.trim();

  if (!trimmedAlias || !trimmedUrl) {
    return { ok: false, error: "Alias and URL are required." };
  }

  if (!isValidAlias(trimmedAlias)) {
    return {
      ok: false,
      error: "Alias can only contain letters, numbers, and dashes.",
    };
  }

  // Requirement #2 – URL validity (syntax, on the backend)
  if (!isValidUrlSyntax(trimmedUrl)) {
    return {
      ok: false,
      error: "Please enter a valid URL starting with http:// or https://",
    };
  }

  const collection = await getCollection(URLS_COLLECTION);

  // Requirement #3 – no repeated aliases
  const existing = await collection.findOne({ alias: trimmedAlias });
  if (existing) {
    return { ok: false, error: "That alias is already taken." };
  }

  const newDoc: ShortUrl = {
    alias: trimmedAlias,
    targetUrl: trimmedUrl,
    createdAt: new Date().toISOString(),
  };

  const result = await collection.insertOne(newDoc);

  if (!result.acknowledged) {
    return {
      ok: false,
      error: "Failed to save URL. Please try again.",
    };
  }

  return { ok: true, shortUrl: newDoc };
}
