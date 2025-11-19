// lib/createNewUrl.ts
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

// Check that the URL actually responds
async function urlExists(url: string): Promise<boolean> {
  try {
    // Try HEAD first
    const headRes = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    });

    if (headRes.status < 400) {
      return true;
    }

    // Some servers don’t support HEAD correctly → fall back to GET
    if (headRes.status === 405 || headRes.status === 501) {
      const getRes = await fetch(url, {
        method: "GET",
        redirect: "follow",
      });
      return getRes.status < 400;
    }

    return false;
  } catch {
    // DNS error, connection error, etc.
    return false;
  }
}

export default async function createNewUrl(
  alias: string,
  targetUrl: string
): Promise<CreateShortUrlResult> {
  const trimmedAlias = alias.trim();
  const trimmedUrl = targetUrl.trim();

  // Basic checks
  if (!trimmedAlias || !trimmedUrl) {
    return { ok: false, error: "Alias and URL are required." };
  }

  // Requirement #2 – URL validity (syntax)
  if (!isValidUrlSyntax(trimmedUrl)) {
    return {
      ok: false,
      error: "Please enter a valid URL starting with http:// or https://",
    };
  }

  // Requirement #2 – URL must actually exist
  const reachable = await urlExists(trimmedUrl);
  if (!reachable) {
    return {
      ok: false,
      error:
        "That URL could not be reached. Please check that it exists and try again.",
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
