// types.ts

export type ShortUrl = {
  alias: string;
  targetUrl: string;
  createdAt: string; // ISO date string
};

export type CreateShortUrlResult = {
  ok: boolean;
  error?: string;
  shortUrl?: ShortUrl;
};
