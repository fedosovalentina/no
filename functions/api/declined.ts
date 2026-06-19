interface Env {
  COUNTER: KVNamespace;
}

function todayMoscow(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Moscow" }).format(new Date());
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const key = `declined:${todayMoscow()}`;
  const raw = await context.env.COUNTER.get(key);
  const count = (raw ? parseInt(raw, 10) : 0) + 1;

  await context.env.COUNTER.put(key, String(count), {
    expirationTtl: 60 * 60 * 24 * 3,
  });

  return Response.json({ count, date: key.replace("declined:", "") });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const key = `declined:${todayMoscow()}`;
  const raw = await context.env.COUNTER.get(key);
  const count = raw ? parseInt(raw, 10) : 0;

  return Response.json({ count, date: key.replace("declined:", "") });
};
