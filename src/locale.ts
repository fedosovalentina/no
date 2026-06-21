import { createDeckPicker } from "./shuffle-pick";
import { phraseKey, type Phrase } from "./phrase";
import { phrases as ruPhrases } from "./phrases";
import { phrasesEn } from "./phrases-en";
import { refreshLabelsRu, refreshLabelsEn } from "./refresh-labels";

export type Locale = "ru" | "en";

export function detectLocale(): Locale {
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const lang of langs) {
    const code = lang.toLowerCase();
    if (code.startsWith("ru")) return "ru";
  }

  return "en";
}

export const locale = detectLocale();

const ui = {
  ru: {
    htmlLang: "ru",
    title: "нет",
    description:
      "Нет. Ноу. Не. Точно нет. Никогда нет. Обнови страницу — новая фраза и новый дизайн.",
    ogDescription: "Обнови страницу — новая фраза «нет», новый шрифт, новый дизайн. Смысл один.",
    ogImageAlt: "НЕТ — обнови, новый отказ",
    ogLocale: "ru_RU",
    footerDeclined: "Отказано сегодня:",
    footerCredit: "Сделано для Романа в 2026 году",
    footerContact: "по всем вопросам пишите",
    refreshAria: "Попробовать ещё раз — новая фраза и дизайн",
    numberLocale: "ru-RU",
  },
  en: {
    htmlLang: "en",
    title: "no",
    description:
      "No. Nope. Nah. Definitely no. Never no. Refresh the page — new phrase, new design.",
    ogDescription: "Refresh the page — a new way to say no, new font, new design. Same meaning.",
    ogImageAlt: "NO — refresh for a new refusal",
    ogLocale: "en_US",
    footerDeclined: "Declined today:",
    footerCredit: "Made for Roman in 2026",
    footerContact: "questions? email",
    refreshAria: "Try again — new phrase and design",
    numberLocale: "en-US",
  },
} as const;

export const copy = ui[locale];

const pickRuPhrase = createDeckPicker(ruPhrases, phraseKey, "no:phrase-deck-ru");
const pickEnPhrase = createDeckPicker(phrasesEn, phraseKey, "no:phrase-deck-en");
const pickRuRefresh = createDeckPicker(refreshLabelsRu, (label) => label, "no:refresh-deck-ru");
const pickEnRefresh = createDeckPicker(refreshLabelsEn, (label) => label, "no:refresh-deck-en");

export function pickPhrase(): Phrase {
  return locale === "ru" ? pickRuPhrase() : pickEnPhrase();
}

export function pickRefreshLabel(): string {
  return locale === "ru" ? pickRuRefresh() : pickEnRefresh();
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name"): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function applyPageCopy(): void {
  const strings = copy;

  document.documentElement.lang = strings.htmlLang;
  document.title = strings.title;

  setMeta("description", strings.description);
  setMeta("og:title", strings.title, "property");
  setMeta("og:description", strings.ogDescription, "property");
  setMeta("og:image:alt", strings.ogImageAlt, "property");
  setMeta("og:locale", strings.ogLocale, "property");
  setMeta("twitter:title", strings.title);
  setMeta("twitter:description", strings.ogDescription);
  setMeta("twitter:image:alt", strings.ogImageAlt);

  document.getElementById("footer-declined-label")!.textContent = strings.footerDeclined;
  document.getElementById("footer-credit")!.childNodes[0]!.textContent = `${strings.footerCredit} `;
  document.getElementById("footer-contact-prefix")!.textContent = `${strings.footerContact} `;
}
