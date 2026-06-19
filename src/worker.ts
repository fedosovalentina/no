function todayMoscow(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Moscow" }).format(new Date());
}

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#0f0f0f"/><text x="16" y="23" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="900" fill="#fff">&#1053;</text></svg>`;

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

function faviconResponse(): Response {
  return new Response(FAVICON_SVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=604800",
    },
  });
}

async function serveAsset(request: Request, env: Env): Promise<Response> {
  const response = await env.ASSETS.fetch(request);
  const path = new URL(request.url).pathname;

  if (response.status === 404 && (path === "/favicon.ico" || path === "/favicon.svg")) {
    return faviconResponse();
  }

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
    const url = new URL(request.url);

    if (url.pathname === "/favicon.ico" || url.pathname === "/favicon.svg") {
      const asset = await env.ASSETS.fetch(request);
      if (asset.ok) return asset;
      return faviconResponse();
    }

    if (url.pathname === "/api/declined") {
      if (request.method === "POST") return handleDeclined(env, true);
      if (request.method === "GET") return handleDeclined(env, false);
      return new Response("Method Not Allowed", { status: 405 });
    }

    return serveAsset(request, env);
  },
};
