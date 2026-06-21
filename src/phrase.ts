export interface Phrase {
  text: string;
  /** Optional subtitle or context line */
  sub?: string;
}

export function phraseKey(phrase: Phrase): string {
  return `${phrase.text}\0${phrase.sub ?? ""}`;
}
