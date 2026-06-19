# нет

https://www.to4no.net — обнови страницу (или пробел): новая фраза «нет», новый дизайн. Смысл один.

## Локально

```bash
npm install
npm run dev          # фронт
npm run dev:worker   # фронт + API (нужен KV binding COUNTER)
```

## Деплой

Push в `main` → Cloudflare Workers Builds (`npm run build` + `npm run deploy`).

Счётчик: `src/worker.ts` → KV binding **`COUNTER`** (см. ниже).

### Счётчик не работает?

1. **Workers & Pages → KV → Create** → имя `no-counter`
2. **Workers & Pages → no → Settings → Bindings → Add**
   - Type: KV namespace
   - Variable name: `COUNTER`
   - Namespace: `no-counter`
3. **Deployments → Retry deployment**

Без KV API отвечает `counter not configured`, в футере будет «—».

## Стек

Vite · TypeScript · Cloudflare Workers · KV · 200+ фраз · 30 тем · Google Fonts
