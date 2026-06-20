function todayMoscow(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Moscow" }).format(new Date());
}

const FAVICON_CACHE = "public, max-age=604800, immutable";

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#0f0f0f"/><text x="16" y="22" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="900" fill="#fff" letter-spacing="-0.04em">no</text></svg>`;

// 32×32 PNG — встроен в воркер, чтобы фавикон работал даже без assets на CDN
const FAVICON_PNG_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAARGVYSWZNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAAgoAMABAAAAAEAAAAgAAAAAKyGYvMAAAGdaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjUxMjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41MTI8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KuC9IVwAAAxBJREFUWAnNV79LqlEYfr5PS8ugmiRwCCoaDGtoSRMkaJOmomjI/oG2/gD3WppcwqGhKYiiHKyhEBUagoSgtn5MQUugRWh5fV7u6Xov9XmytPvCx6ffOed9nve8v84xyhXBbymVSshkMtja2sLGxgY4ZBiGGq7rrXQsLCxgenoafr8fdrv9TZehCJydnWF5eVkIcFFbW9vbpO/48fT0JMaQwOrqKoaHh0WtEMjlcpiamsLd3R06Ojrw+voq1n8HsNLBnTRNE/l8Hm63G7u7u/D5fDCen5/L4XAYqVRKwIvFolrTkHdLS4uQCAaD2Nvbg5FOp8uTk5Nob29Ho8GVRSTx+PiIg4MD2FwuV/T09FQCg75vhtAdNLa1tRVGZ2dn2Wazic/p+2YIY4EkXl5eYDbL6vcMI7b51Tx/T7HuN8kM3cmNmmc2SrGu3h8n8Kco16DMiOXDjOGbGeNwOCSa2UP40KfMcUa5rmgRIJjH45Hn+voavb29UjUrRQwPDw8YGBjA0NCQVLiTkxMUCoW/Go4VGS0CbCSzs7OIRqO4vLzE4OCg6FxfX8fh4SFisRi6u7vlWzabxfz8PO7v72W3rMA5pr1Xql5cXV1hcXFRrGR7XVtbQ6WaYmZmBvF4HGNjY4hEIqj0mFrYMq5NQGlLJBLY3NyUztnV1SWd7fb2Ftvb29jf35dpdImuaLmgWhkPE06nUwKNvmbw9fT0YGJiAqFQSKbe3NxUL7H8rb0DjH6KinA2Ena0lZUV+ZZMJrG0tITz83M5TTFDdESrGTHt+vr60N/fj4uLC3DL2c9J6ujoCF6vFyMjI5IFx8fHEoBMx4+kuhlpEaAiletUTGAVZNwJjrG9sg7QcrVLOgS0Y4C+rz5MVm8xSVlZ/BERfteOASslXxn7eQKqwHzFinrX/h8HEt5Y1KWhXks+u47ZQkxim3Nzc5I+tVLnsyBW81UdILY5OjqKQCAgRaTeVLIC+3eMGLwdEZPYP341kzTkHW1nZwfj4+NS31VM0Fff9VAnewcxiEVMytvtmH9YUpt9Pf8FvId5igJtk2YAAAAASUVORK5CYII=";

function decodeBase64(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

const FAVICON_PNG = decodeBase64(FAVICON_PNG_B64);

async function handleDeclined(env: Env, increment: boolean): Promise<Response> {
  if (!env.COUNTER) {
    return Response.json({ count: null, error: "counter not configured" }, { status: 503 });
  }

  const key = `declined:${todayMoscow()}`;
  const raw = await env.COUNTER.get(key);
  const current = raw ? parseInt(raw, 10) : 0;
  const count = increment ? current + 1 : current;

  if (increment) {
    await env.COUNTER.put(key, String(count), {
      expirationTtl: 60 * 60 * 24 * 3,
    });
  }

  return Response.json({ count, date: key.replace("declined:", "") });
}

function faviconSvgResponse(): Response {
  return new Response(FAVICON_SVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": FAVICON_CACHE,
    },
  });
}

function faviconPngResponse(): Response {
  return new Response(FAVICON_PNG, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": FAVICON_CACHE,
    },
  });
}

function faviconResponse(pathname: string): Response | null {
  if (pathname === "/favicon.svg") return faviconSvgResponse();
  if (pathname === "/favicon.ico" || /^\/favicon-\d+x\d+\.png$/.test(pathname)) {
    return faviconPngResponse();
  }
  return null;
}

async function serveAsset(request: Request, env: Env): Promise<Response> {
  const response = await env.ASSETS.fetch(request);
  const path = new URL(request.url).pathname;

  if (!response.ok) return response;

  if (path === "/" || path.endsWith(".html")) {
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "no-cache, must-revalidate");
    return new Response(response.body, { status: response.status, headers });
  }

  return response;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const pathname = new URL(request.url).pathname;

    const favicon = faviconResponse(pathname);
    if (favicon) return favicon;

    if (pathname === "/api/declined") {
      if (request.method === "POST") return handleDeclined(env, true);
      if (request.method === "GET") return handleDeclined(env, false);
      return new Response("Method Not Allowed", { status: 405 });
    }

    return serveAsset(request, env);
  },
};
