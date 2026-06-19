interface Env {
  ASSETS: Fetcher;
  COUNTER?: KVNamespace;
}

function todayMoscow(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Moscow" }).format(new Date());
}

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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/declined") {
      if (request.method === "POST") return handleDeclined(env, true);
      if (request.method === "GET") return handleDeclined(env, false);
      return new Response("Method Not Allowed", { status: 405 });
    }

    return env.ASSETS.fetch(request);
  },
};
