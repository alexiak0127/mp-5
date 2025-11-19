"use client";

import type { ShortUrl } from "@/types";
import NewUrlForm from "./NewUrlForm";

export default function UrlsDisplay() {
  const handleCreated = (url: ShortUrl) => {
    console.log("Created short URL:", url);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
      <h1>URL Shortener</h1>
      <p style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
        Enter a long URL and an alias to create a short link.
      </p>
      <NewUrlForm onCreated={handleCreated} />
    </div>
  );
}
