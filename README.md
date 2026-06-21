# нет

https://www.to4no.net — обнови страницу (или пробел): новая фраза «нет», новый дизайн. Смысл один.

## Что где править

| Что | Файл |
|-----|------|
| Фразы «нет» | `src/phrases.ts` → массив `phrases` |
| Дизайны / шрифты / темы | `src/themes.ts` |
| Подписи кнопки («Может повезёт?»…) | `src/refresh-labels.ts` |
| Стили, вёрстка | `src/style.css` |
| Футер, meta, фавикон в HTML | `index.html` |
| Фавикон (картинки) | `public/favicon.svg`, `public/icon-master.svg` → пересобрать PNG |
| Счётчик API | `src/worker.ts` |
| Cloudflare (домены, KV) | `wrangler.toml` |

Пример новой фразы:

```ts
{ text: "ни за что" },
{ text: "не в этой", sub: "вселенной" }, // sub — вторая строка под основной
```

Фразы, темы и подписи кнопки **не повторяются**, пока не пройдёшь весь набор (логика в `src/shuffle-pick.ts`).

## Локально

```bash
npm install
npm run dev          # только фронт → http://localhost:5173
npm run dev:worker   # фронт + API (нужен KV binding COUNTER)
```

После правок смотри в браузере, жми «обновить» или пробел.

## Залить на сайт

### Вариант 1 — с компьютера (быстро)

```bash
npm run build
npm run deploy
```

Нужен `wrangler login` (один раз). KV и домены уже прописаны в `wrangler.toml`.

### Вариант 2 — через GitHub

```bash
git add .
git commit -m "описание изменений"
git push
```

Cloudflare Workers Builds подхватит push в `main` и сам сделает `npm run build` + `npm run deploy`.

---

**Важно:** после правок **сохрани файлы** (Cmd+S) — иначе на диск попадёт старая версия и на сайт уедет не то.

**Если на сайте старые фразы / старый дизайн:**

1. Cloudflare Dashboard → **Workers & Pages → no → Deployments**
2. **Purge build cache**
3. **Create deployment from main** (не Retry старого деплоя)

Или локально: `npm run build && npm run deploy`.

В браузере: **Cmd+Shift+R** (жёсткое обновление) — кэшируются JS и фавикон.

## Счётчик

API: `src/worker.ts` → KV binding **`COUNTER`**.

### Счётчик не работает?

1. **Workers & Pages → KV → Create** → имя `no-counter`
2. **Workers & Pages → no → Settings → Bindings → Add**
   - Type: KV namespace
   - Variable name: `COUNTER`
   - Namespace: `no-counter`
3. **Deployments → Retry deployment**

Без KV API отвечает `counter not configured`, в футере будет «—».

## Стек

Vite · TypeScript · Cloudflare Workers · KV · ~100 фраз · 30 тем · Google Fonts
