# нет

Сайт, который каждый раз говорит «нет» — по-новому.

Обнови страницу (или нажми пробел) — новая фраза, новый шрифт, новый дизайн, новая анимация. Смысл один.

**Прод:** https://www.to4no.net — Cloudflare Workers (не Pages, не GitHub Pages).

## Запуск локально

```bash
npm install
npm run dev          # только фронт (счётчик покажет «—»)
npm run dev:worker   # фронт + /api/declined через wrangler (нужен KV binding)
```

## Сборка и деплой

```bash
npm run build
npm run deploy       # wrangler deploy (на проде делает Cloudflare Builds)
```

Деплой на push в `main` — через **Cloudflare Workers Builds** (GitHub → Cloudflare).
Build command: `npm run build`, deploy command: `npm run deploy`.

### Счётчик «Отказано сегодня»

Worker `src/worker.ts` + KV binding `COUNTER` в Cloudflare Dashboard.

## Архитектура

```
GitHub (main)
    → Cloudflare Workers Builds
        → npm run build  → dist/ (статика Vite)
        → npm run deploy → wrangler (Worker + assets)

Worker src/worker.ts
    → POST /api/declined  → KV (глобальный счётчик)
    → всё остальное       → dist/ (HTML, CSS, JS)
```

## Что внутри

- **200+ фраз** — от «нет» до «отказано GDPR»
- **30 визуальных тем** — brutalist, neon, soviet, terminal, comic, gothic, vaporwave…
- **25 анимаций** — glitch, typewriter, stamp, bounce, marquee…
- **Google Fonts** — каждая тема подгружает свой шрифт
