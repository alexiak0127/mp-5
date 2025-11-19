"use client";

import { useState } from "react";
import type { ShortUrl, CreateShortUrlResult } from "@/types";
import createNewUrl from "@/lib/createNewUrl";

type Props = {
  onCreated: (url: ShortUrl) => void;
};

export default function NewUrlForm({ onCreated }: Props) {
  const [alias, setAlias] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<ShortUrl | null>(null);
  const [loading, setLoading] = useState(false);

  const origin =
    typeof window === "undefined" ? "" : window.location.origin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLastCreated(null);
    setLoading(true);

    try {
      const result: CreateShortUrlResult = await createNewUrl(
        alias,
        targetUrl
      );

      if (!result.ok || !result.shortUrl) {
        setError(result.error ?? "Something went wrong.");
      } else {
        onCreated(result.shortUrl);
        setLastCreated(result.shortUrl);
        setAlias("");
        setTargetUrl("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const shortUrl =
    lastCreated && origin ? `${origin}/${lastCreated.alias}` : null;

  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Long URL (https://...)"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Alias (e.g. cs391)"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-700 hover:bg-pink-800 disabled:bg-pink-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? "Creating..." : "Create Short URL"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {shortUrl && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <strong className="text-green-900 block mb-2">✓ Your new short URL:</strong>
          <div className="mt-2 p-3 bg-white border border-gray-300 rounded-lg">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {shortUrl}
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Click the link to test the redirect, or select and copy.
          </p>
        </div>
      )}
    </div>
  );
}
