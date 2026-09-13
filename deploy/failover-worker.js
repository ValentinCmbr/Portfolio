// Cloudflare Worker — routes requests to the VPS, and falls back to the
// Vercel deployment when the VPS doesn't answer in time.
//
// Setup (Cloudflare dashboard, free plan):
//   1. Workers & Pages -> Create -> paste this file.
//   2. Settings -> Triggers -> Add route: valentincombier.com/* (and
//      www.valentincombier.com/*), zone = your domain.
//   3. DNS: keep the A record for valentincombier.com pointing at the VPS IP,
//      proxied (orange cloud) — the Worker runs in front of it, it does not
//      replace the DNS record.
//
// Adjust ORIGIN_TIMEOUT_MS if the VPS is legitimately slow sometimes and you
// see false failovers; 4s is generous for a static file server.

const VERCEL_FALLBACK = "https://valentincombier.vercel.app";
const ORIGIN_TIMEOUT_MS = 4000;

export default {
  async fetch(request) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ORIGIN_TIMEOUT_MS);

    try {
      const originResponse = await fetch(request, { signal: controller.signal });
      clearTimeout(timeout);
      if (originResponse.status < 500) return originResponse;
      // VPS answered but is erroring (e.g. Nginx down, bad config) — fall through.
    } catch (err) {
      clearTimeout(timeout);
      // VPS unreachable or timed out — fall through to Vercel.
    }

    const fallbackUrl = new URL(request.url);
    fallbackUrl.hostname = new URL(VERCEL_FALLBACK).hostname;
    return fetch(new Request(fallbackUrl, request));
  },
};
