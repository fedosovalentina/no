export type Locale = "ru" | "en";

export function detectLocaleFromList(langs: readonly string[]): Locale {
  for (const lang of langs) {
    if (lang.toLowerCase().startsWith("ru")) return "ru";
  }
  return "en";
}

export function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "en";
  const langs = acceptLanguage.split(",").map((part) => part.trim().split(";")[0]!);
  return detectLocaleFromList(langs);
}

export function detectLocaleFromNavigator(): Locale {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return detectLocaleFromList(langs);
}
