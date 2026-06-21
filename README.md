# нет

https://www.to4no.net — обнови страницу (или пробел): новая фраза «нет», новый дизайн. Смысл один.

## Что где править

| Что | Файл |
|-----|------|
| Фразы «нет» (RU) | `src/phrases.ts` → массив `phrases` |
| Фразы «нет» (EN) | `src/phrases-en.ts` |
| Embed-фразы для расшара (RU/EN) | `src/embed-phrases.ts` |
| Дизайны / шрифты / темы | `src/themes.ts` |
| Подписи кнопки RU / EN | `src/refresh-labels.ts` |
| Тексты UI, meta в браузере | `src/locale.ts` |
| Дизайн OG-картинки | `src/og-image.ts` |
| Meta для краулеров (Telegram и т.д.) | `src/og-meta.ts` + `src/worker.ts` |
| Превью эмбедов | `src/embed-preview.ts`, страница `/embed` |
| Стили, вёрстка | `src/style.css` |
| Футер, фавикон в HTML | `index.html` |
| Фавикон (картинки) | `public/favicon.svg` → пересобрать PNG из `icon-master.svg` |
| Cloudflare (домены, KV) | `wrangler.toml` |

Пример новой фразы:

```ts
{ text: "ни за что" },
{ text: "не в этой", sub: "вселенной" }, // sub — вторая строка под основной
```

Фразы, темы и подписи кнопки **не повторяются**, пока не пройдёшь весь набор (логика в `src/shuffle-pick.ts`).

## Локализация

Сейчас: **русский** (если в браузере `ru`) и **английский** (всё остальное).

Переключается автоматически по `navigator.language` на сайте и по `Accept-Language` в воркере (для OG/meta).

### Добавить новый язык (например, `de`)

1. **Фразы на сайте** — `src/phrases-de.ts` (массив как в `phrases.ts`)
2. **Подписи кнопки** — массив в `src/refresh-labels.ts` (`refreshLabelsDe`)
3. **Embed-фразы для расшара** — `embedPhrasesDe` + блок в `embedCopy` в `src/embed-phrases.ts`
4. **Тексты UI** — блок `de: { ... }` в `ui` в `src/locale.ts` (футер, description, aria)
5. **Детект языка** — в `src/locale-detect.ts` добавить проверку `de` **до** fallback на `en`
6. **Пикеры** — в `src/locale.ts` подключить `pickDePhrase()` / `pickDeRefresh()` через `createDeckPicker`
7. **OG для краулеров** — в `src/og-meta.ts` и `src/worker.ts` расширить тип `Locale` и ветки `lang=de` в `/og.svg`

Проверка: Chrome DevTools → Sensors → Locale → нужный язык, или `curl -H "Accept-Language: de" https://www.to4no.net/`.

## Эмбеды (расшар в мессенджерах)

При шаринге ссылки Telegram / VK / Discord / X / Slack подтягивают **og:title**, **og:description**, **og:image**.

У нас это генерирует **воркер** — каждый раз случайная «интригующая» фраза (отдельный пул, не путать с «нет» на сайте):

- **Картинка:** `https://www.to4no.net/og.svg?lang=ru&i=0` — тёмная карточка с фразой и to4no.net
- **Превью платформ:** [to4no.net/embed](https://www.to4no.net/embed) — как выглядит в Telegram, VK, Discord, X, Slack

| Поле | Что попадает |
|------|----------------|
| `og:title` | Случайная embed-фраза («Ответ уже ждёт вас» / «Your answer is waiting») |
| `og:description` | Нейтральная строка («Сервис для тех, кому важна точность») |
| `og:image` | Та же фраза, нарисованная на карточке |

Фразы для эмбеда — в `src/embed-phrases.ts` (`embedPhrasesRu`, `embedPhrasesEn`). Дизайн карточки — `src/og-image.ts`.

Платформы кэшируют превью надолго; для проверки удобнее `/embed` или прямой URL `/og.svg?...`.

## Секреты и локальная разработка

В репозиторий **не попадают** (см. `.gitignore`):

| Файл / папка | Зачем |
|--------------|--------|
| `.wrangler/` | Локальный кэш Wrangler, собранные воркеры |
| `.dev.vars` | Секреты для `wrangler dev` (если появятся) |
| `.env`, `.env.*` | Переменные окружения |
| `dist/` | Сборка — деплоится через CI / `wrangler deploy` |

`CLOUDFLARE_API_TOKEN` для деплоя с машины — только в окружении или `wrangler login`, **не в git**.

`wrangler.toml` содержит **ID** KV-namespace — это не секрет (как имя бакета), только привязка к ресурсу в аккаунте.

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

Vite · TypeScript · Cloudflare Workers · KV · RU + EN · ~110 фраз · 30 тем · динамический OG
