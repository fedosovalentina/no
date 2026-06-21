import { embedCopy, getEmbedPhrase, ogImageUrl } from "./embed-phrases";
import type { Locale } from "./locale-detect";
import { escapeHtmlAttr } from "./og-image";

export interface OgMetaPayload {
  locale: Locale;
  phraseIndex: number;
  origin: string;
}

export function buildOgMeta(payload: OgMetaPayload): {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  locale: string;
  siteTitle: string;
} {
  const strings = embedCopy[payload.locale];
  const phrase = getEmbedPhrase(payload.locale, payload.phraseIndex);

  return {
    title: phrase,
    description: strings.ogDescription,
    image: ogImageUrl(payload.origin, payload.locale, payload.phraseIndex),
    imageAlt: phrase,
    locale: payload.locale === "ru" ? "ru_RU" : "en_US",
    siteTitle: payload.locale === "ru" ? "нет" : "no",
  };
}

function replaceMeta(
  html: string,
  attr: "name" | "property",
  key: string,
  value: string,
): string {
  const escaped = escapeHtmlAttr(value);
  const pattern = new RegExp(
    `<meta ${attr}="${key}" content="[^"]*"\\s*/>`,
    "i",
  );
  if (pattern.test(html)) {
    return html.replace(pattern, `<meta ${attr}="${key}" content="${escaped}" />`);
  }
  return html;
}

export function injectOgMeta(html: string, payload: OgMetaPayload): string {
  const meta = buildOgMeta(payload);

  let out = html;
  out = out.replace(/<html lang="[^"]*"/i, `<html lang="${payload.locale}"`);
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtmlAttr(meta.siteTitle)}</title>`);
  out = replaceMeta(out, "property", "og:title", meta.title);
  out = replaceMeta(out, "property", "og:description", meta.description);
  out = replaceMeta(out, "property", "og:image", meta.image);
  out = replaceMeta(out, "property", "og:image:alt", meta.imageAlt);
  out = replaceMeta(out, "property", "og:locale", meta.locale);
  out = replaceMeta(out, "name", "twitter:title", meta.title);
  out = replaceMeta(out, "name", "twitter:description", meta.description);
  out = replaceMeta(out, "name", "twitter:image", meta.image);
  out = replaceMeta(out, "name", "twitter:image:alt", meta.imageAlt);
  out = replaceMeta(out, "name", "description", meta.description);
  return out;
}

// re-export for worker
export { embedPhraseCount, getEmbedPhrase, pickRandomEmbedIndex } from "./embed-phrases";
