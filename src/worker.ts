function todayMoscow(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Moscow" }).format(new Date());
}

const FAVICON_CACHE = "public, max-age=604800, immutable";

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#0f0f0f"/><text x="16" y="23" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="900" fill="#fff">&#1053;</text></svg>`;

// 32×32 PNG — встроен в воркер, чтобы фавикон работал даже без assets на CDN
const FAVICON_PNG_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACshmLzAAACmklEQVRYCe2XPY8SQRjHZ5clkBBeGqUA/ALGAkJjYk4TGhMSCkJiY21jYfgS9rbmGiKFlnTaaIRLzsr7GpeDAigIyJvPb+Mk7N4KO8ARC59k2J15Zp7//3mZGdZSXnHS6fSZDL2Q9sqrOrj3Xix8Go1GXXkutDVLvwhwybKsd+v1+kkkEtHDR30ul0slGBeC8UaI/MS4SyCTyRRl8IsA37NtW61WKyX9o4ILsNK2hciN9J8Ph8MrCMRSqdQ3x3EeM2E+nx8V2G8sGo26Di4Wi8vxePzMEu/PxNvvKO4aXJPRWBKFp5FYLPZWQv+IkB877BrQ/9xIx9KS4ltTdICT+1MIqYYERWmfAnAbhhEBojSdTgMjhTfoTNMYmgAA2WxWtdttVSwWPQVL8ZbLZVfHHOaGldAE8CyZTKpGo6Hy+bwHBMBCoeDqmGMShdAE8AjDFGqQh4yhNwHHpsOPqcxmM0XTu4YU0N9HjAkAWq1WVS6XUxwoCARKpVJgZHaRMiZAqGu1mqpUKu5eBoCwJxKJ0xDA62azqTqdjorH466DbL96va5ardYuh2/pjSOABblI3LDra5sUMLaP7EWAY1Q3QDffTUkYbUOAOMdpftHnO3NM5Lalv6zG8GQyUd1uVw0GAw8JwPv9vur1eu4cExJGtyHVzi4g936QbTq/Tzpa2DKqAUDln5Pfntvfpgtc8GcwdAq2GTlE95/APxGBc3Lor+pD8rpr7QbWuS2dD2yHoMNll6F99WCBCbYtXyc/ZA9fcs3q63Vfw2HWgQEWmGCzqX8Jo9fC6LO839+YEMZe6DmEHc8BF6wbMMF2v0LlOr2Wq/WrDDwU5QMmsuCYDabcmELgQuy+lI/TK8b8N8edfp4L8EcJew8ugCO/AQdeRu0kzQTgAAAAAElFTkSuQmCC";

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
