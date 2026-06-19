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

Счётчик: `src/worker.ts` → KV `COUNTER` в Dashboard.

## Стек

Vite · TypeScript · Cloudflare Workers · KV · 200+ фраз · 30 тем · Google Fonts
