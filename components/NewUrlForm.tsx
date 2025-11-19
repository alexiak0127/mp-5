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
    <div style={{ marginTop: "1rem" }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "0.75rem" }}
      >
        <input
          type="text"
          placeholder="Long URL (https://...)"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Alias (e.g. cs391)"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create short URL"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
      )}

      {shortUrl && (
        <div style={{ marginTop: "0.75rem" }}>
          <strong>Your new short URL:</strong>
          <div
            style={{
              marginTop: "0.25rem",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: 4,
              userSelect: "all",
              cursor: "pointer",
            }}
          >
            {shortUrl}
          </div>
          <p style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
            (Click then press ⌘+C / Ctrl+C to copy.)
          </p>
        </div>
      )}
    </div>
  );
}
