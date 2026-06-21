import type { Locale } from "./locale-detect";

export const embedPhrasesRu: readonly string[] = [
  "Срочно! Вам пришёл ответ на вопрос",
  "Собеседник составил для вас ответное письмо",
  "Потому что определённость важна",
  "Точность — вежливость королей",
  "Ответ уже ждёт вас",
  "Ваш вопрос не остался без ответа",
  "Кто-то написал вам кое-что важное",
  "Пора расставить все точки над i",
  "Момент истины наступил",
  "Неопределённость закончилась",
];

export const embedPhrasesEn: readonly string[] = [
  "Urgent! Your answer has arrived",
  "Your correspondent has prepared a reply",
  "Because clarity matters",
  "Precision is the politeness of kings",
  "Your answer is waiting",
  "Your question did not go unanswered",
  "Someone wrote you something important",
  "Time to dot the i's and cross the t's",
  "The moment of truth has come",
  "The uncertainty is over",
  "A verdict has been reached",
  "The suspense ends here",
  "Your response is ready",
  "The answer you've been waiting for",
  "No more wondering",
  "Consider it settled",
  "The decision is in",
  "Your reply awaits",
  "The fog has lifted",
  "All will be revealed",
];

export const embedCopy = {
  ru: {
    linkTitle: "Узнать точно",
    ogDescription: "Сервис для тех, кому важна точность",
    siteLabel: "to4no.net",
    previewHeading: "Как выглядит расшар",
    previewSub: "to4no.net — embed preview",
    anotherPhrase: "↻ другая фраза",
    platformNotes: "Особенности платформ",
    platformRows: [
      ["Telegram", "Показывает og:image + og:title под картинкой"],
      ["ВКонтакте", "Аналогично Telegram, картинка сверху"],
      ["Discord", "og:title как заголовок, og:description отдельно, thumbnail сбоку"],
      ["X / Twitter", "summary_large_image — большая картинка, домен под ней"],
      ["Slack", "og:title жирным + og:description + картинка снизу"],
    ] as const,
  },
  en: {
    linkTitle: "Find out for sure",
    ogDescription: "For when you need a clear answer",
    siteLabel: "to4no.net",
    previewHeading: "How the share preview looks",
    previewSub: "to4no.net — embed preview",
    anotherPhrase: "↻ another phrase",
    platformNotes: "Platform quirks",
    platformRows: [
      ["Telegram", "Shows og:image + og:title below the image"],
      ["VK", "Same as Telegram — image on top"],
      ["Discord", "og:title as headline, og:description separate, thumbnail on the side"],
      ["X / Twitter", "summary_large_image — large image, domain below"],
      ["Slack", "og:title bold + og:description + image at the bottom"],
    ] as const,
  },
} as const;

export function embedPhraseList(locale: Locale): readonly string[] {
  return locale === "ru" ? embedPhrasesRu : embedPhrasesEn;
}

export function embedPhraseCount(locale: Locale): number {
  return embedPhraseList(locale).length;
}

export function getEmbedPhrase(locale: Locale, index: number): string {
  const list = embedPhraseList(locale);
  const safe = ((index % list.length) + list.length) % list.length;
  return list[safe]!;
}

export function pickRandomEmbedIndex(locale: Locale): number {
  return Math.floor(Math.random() * embedPhraseCount(locale));
}

export function ogImageUrl(origin: string, locale: Locale, index: number): string {
  return `${origin}/og.svg?lang=${locale}&i=${index}`;
}
