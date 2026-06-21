export interface OgImageOptions {
  width?: number;
  height?: number;
  /** Card strip for Discord / Slack thumbnails */
  compact?: boolean;
  hidePhrase?: boolean;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapPhrase(phrase: string, maxCharsPerLine: number): string[] {
  const words = phrase.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxCharsPerLine && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

export function buildOgSvg(phrase: string, options: OgImageOptions = {}): string {
  const width = options.width ?? 1200;
  const height = options.height ?? 630;
  const compact = options.compact ?? false;
  const hidePhrase = options.hidePhrase ?? false;

  const lines = wrapPhrase(phrase, compact ? 22 : 28);
  const fontSize = compact ? 22 : lines.length > 2 ? 46 : 54;
  const lineHeight = compact ? 30 : lines.length > 2 ? 58 : 66;
  const startY = compact
    ? 42
    : height / 2 - ((lines.length - 1) * lineHeight) / 2;

  const phraseSvg = hidePhrase
    ? ""
    : lines
        .map((line, i) => {
          const y = startY + i * lineHeight;
          return `<text x="72" y="${y}" fill="#f4f4f5" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="600" letter-spacing="-0.02em">${escapeXml(line)}</text>`;
        })
        .join("");

  const accent = compact ? 52 : 72;
  const siteY = compact ? height - 24 : height - 56;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="45%" stop-color="#160812"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="28%" r="55%">
      <stop offset="0%" stop-color="#e879a9" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#e879a9" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <rect x="${accent - 20}" y="${compact ? 18 : 40}" width="4" height="${compact ? height - 36 : height - 80}" rx="2" fill="#e879a9" fill-opacity="0.85"/>
  ${phraseSvg}
  <text x="${accent}" y="${siteY}" fill="#e879a9" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="${compact ? 13 : 22}" letter-spacing="0.14em">to4no.net</text>
  ${compact ? "" : `<text x="${width - 72}" y="${height - 56}" text-anchor="end" fill="#ffffff" fill-opacity="0.12" font-family="system-ui, sans-serif" font-size="120" font-weight="900">?</text>`}
</svg>`;
}

export function escapeHtmlAttr(text: string): string {
  return escapeXml(text);
}
