"use client";

import type { ShortUrl } from "@/types";
import NewUrlForm from "./NewUrlForm";

export default function UrlsDisplay() {
  const handleCreated = (url: ShortUrl) => {
    console.log("Created short URL:", url);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
          URL Shortener
        </h1>
        <p className="text-lg text-gray-600">
          Enter a long URL and an alias to create a short link.
        </p>
      </div>
      <NewUrlForm onCreated={handleCreated} />
    </div>
  );
}
