import { createDeckPicker } from "./shuffle-pick";

export type AnimationId =
  | "none"
  | "fade"
  | "shake"
  | "pulse"
  | "bounce"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "rotate-in"
  | "flip"
  | "glitch"
  | "typewriter"
  | "zoom"
  | "blur-in"
  | "swing"
  | "rubber"
  | "float"
  | "strobe"
  | "marquee"
  | "wave"
  | "scatter"
  | "split"
  | "ink"
  | "stamp";

export interface Theme {
  id: string;
  name: string;
  font: string;
  fontWeights?: string;
  /** Extra decorative font for subtitles */
  accentFont?: string;
  accentWeights?: string;
  layout: "center" | "diagonal" | "stack" | "split" | "marquee-wrap";
  animation: AnimationId;
  css: Record<string, string>;
  /** Optional HTML decoration */
  decoration?: "none" | "grid" | "dots" | "scanlines" | "noise" | "circles" | "stripes" | "stars";
  /** Extra class on root */
  className?: string;
}

export const themes: Theme[] = [
  {
    id: "brutalist",
    name: "Brutalist",
    font: "Space Grotesk",
    fontWeights: "700",
    layout: "center",
    animation: "shake",
    decoration: "grid",
    css: {
      "--bg": "#f5f0e8",
      "--fg": "#0a0a0a",
      "--accent": "#ff2d2d",
      "--size": "clamp(4rem, 18cqmin, 14rem)",
      "--weight": "700",
      "--transform": "rotate(-2deg)",
      "--letter-spacing": "-0.04em",
      "--border": "6px solid #0a0a0a",
      "--shadow": "12px 12px 0 #0a0a0a",
    },
  },
  {
    id: "neon",
    name: "Neon",
    font: "Orbitron",
    fontWeights: "900",
    layout: "center",
    animation: "pulse",
    decoration: "scanlines",
    css: {
      "--bg": "#0a0014",
      "--fg": "#ff00ff",
      "--accent": "#00ffff",
      "--size": "clamp(3rem, 14cqmin, 10rem)",
      "--weight": "900",
      "--transform": "none",
      "--letter-spacing": "0.15em",
      "--glow": "0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff",
      "--text-shadow": "var(--glow)",
    },
  },
  {
    id: "soviet",
    name: "Soviet Poster",
    font: "Russo One",
    fontWeights: "400",
    layout: "stack",
    animation: "stamp",
    decoration: "stripes",
    css: {
      "--bg": "#c41e1e",
      "--fg": "#ffd700",
      "--accent": "#ffffff",
      "--size": "clamp(3.5rem, 16cqmin, 11rem)",
      "--weight": "400",
      "--transform": "uppercase",
      "--letter-spacing": "0.08em",
      "--sub-size": "1.5rem",
    },
  },
  {
    id: "sticky",
    name: "Sticky Note",
    font: "Caveat",
    fontWeights: "700",
    layout: "center",
    animation: "swing",
    decoration: "none",
    className: "theme-sticky",
    css: {
      "--bg": "#fef9c3",
      "--fg": "#1a1a1a",
      "--accent": "#ef4444",
      "--size": "clamp(3rem, 12cqmin, 7rem)",
      "--weight": "700",
      "--transform": "rotate(3deg)",
      "--letter-spacing": "0",
    },
  },
  {
    id: "terminal",
    name: "Terminal",
    font: "JetBrains Mono",
    fontWeights: "700",
    layout: "center",
    animation: "typewriter",
    decoration: "scanlines",
    css: {
      "--bg": "#0d1117",
      "--fg": "#39ff14",
      "--accent": "#39ff14",
      "--size": "clamp(2rem, 8cqmin, 5rem)",
      "--weight": "700",
      "--transform": "none",
      "--letter-spacing": "0.05em",
      "--font-mono": "1",
    },
  },
  {
    id: "corporate",
    name: "Corporate",
    font: "IBM Plex Sans",
    fontWeights: "300;600",
    accentFont: "IBM Plex Serif",
    accentWeights: "400",
    layout: "stack",
    animation: "fade",
    decoration: "none",
    className: "theme-corporate",
    css: {
      "--bg": "#ffffff",
      "--fg": "#1e293b",
      "--accent": "#64748b",
      "--size": "clamp(2rem, 6cqmin, 4rem)",
      "--weight": "300",
      "--transform": "none",
      "--letter-spacing": "0.02em",
      "--sub-size": "1rem",
    },
  },
  {
    id: "comic",
    name: "Comic",
    font: "Bangers",
    fontWeights: "400",
    layout: "center",
    animation: "bounce",
    decoration: "dots",
    className: "theme-comic",
    css: {
      "--bg": "#fef08a",
      "--fg": "#dc2626",
      "--accent": "#1d4ed8",
      "--size": "clamp(4rem, 20cqmin, 16rem)",
      "--weight": "400",
      "--transform": "rotate(-5deg)",
      "--letter-spacing": "0.05em",
      "--stroke": "4px #0a0a0a",
    },
  },
  {
    id: "zen",
    name: "Zen",
    font: "Noto Serif JP",
    fontWeights: "200",
    layout: "center",
    animation: "blur-in",
    decoration: "circles",
    css: {
      "--bg": "#fafafa",
      "--fg": "#525252",
      "--accent": "#a3a3a3",
      "--size": "clamp(2.5rem, 10cqmin, 6rem)",
      "--weight": "200",
      "--transform": "none",
      "--letter-spacing": "0.3em",
    },
  },
  {
    id: "retro80",
    name: "Retro 80s",
    font: "Press Start 2P",
    fontWeights: "400",
    layout: "center",
    animation: "strobe",
    decoration: "grid",
    css: {
      "--bg": "linear-gradient(180deg, #1a0533 0%, #ff006e 50%, #ffbe0b 100%)",
      "--fg": "#ffffff",
      "--accent": "#00f5d4",
      "--size": "clamp(1.5rem, 6cqmin, 4rem)",
      "--weight": "400",
      "--transform": "none",
      "--letter-spacing": "0.1em",
      "--line-height": "1.8",
    },
  },
  {
    id: "glitch",
    name: "Glitch",
    font: "Rubik Glitch",
    fontWeights: "400",
    layout: "center",
    animation: "glitch",
    decoration: "noise",
    css: {
      "--bg": "#000000",
      "--fg": "#ffffff",
      "--accent": "#ff0040",
      "--size": "clamp(3rem, 14cqmin, 10rem)",
      "--weight": "400",
      "--transform": "none",
      "--letter-spacing": "0",
    },
  },
  {
    id: "watercolor",
    name: "Watercolor",
    font: "Cormorant Garamond",
    fontWeights: "600",
    layout: "diagonal",
    animation: "ink",
    decoration: "none",
    className: "theme-watercolor",
    css: {
      "--bg": "#fdf2f8",
      "--fg": "#9d174d",
      "--accent": "#f472b6",
      "--size": "clamp(3rem, 12cqmin, 8rem)",
      "--weight": "600",
      "--transform": "rotate(-8deg)",
      "--letter-spacing": "0.05em",
    },
  },
  {
    id: "newspaper",
    name: "Newspaper",
    font: "Playfair Display",
    fontWeights: "900",
    layout: "stack",
    animation: "slide-up",
    decoration: "stripes",
    css: {
      "--bg": "#f5f5f0",
      "--fg": "#1a1a1a",
      "--accent": "#737373",
      "--size": "clamp(3rem, 14cqmin, 9rem)",
      "--weight": "900",
      "--transform": "none",
      "--letter-spacing": "-0.02em",
      "--sub-size": "0.875rem",
    },
  },
  {
    id: "warning",
    name: "Warning",
    font: "Black Ops One",
    fontWeights: "400",
    layout: "center",
    animation: "shake",
    decoration: "stripes",
    className: "theme-warning",
    css: {
      "--bg": "#facc15",
      "--fg": "#0a0a0a",
      "--accent": "#dc2626",
      "--size": "clamp(3rem, 14cqmin, 10rem)",
      "--weight": "400",
      "--transform": "none",
      "--letter-spacing": "0.05em",
    },
  },
  {
    id: "candy",
    name: "Candy",
    font: "Fredoka",
    fontWeights: "700",
    layout: "center",
    animation: "rubber",
    decoration: "dots",
    css: {
      "--bg": "#fce7f3",
      "--fg": "#ec4899",
      "--accent": "#a855f7",
      "--size": "clamp(3rem, 14cqmin, 10rem)",
      "--weight": "700",
      "--transform": "none",
      "--letter-spacing": "0",
    },
  },
  {
    id: "gothic",
    name: "Gothic",
    font: "UnifrakturMaguntia",
    fontWeights: "400",
    layout: "center",
    animation: "fade",
    decoration: "stars",
    css: {
      "--bg": "#0c0a09",
      "--fg": "#e7e5e4",
      "--accent": "#78716c",
      "--size": "clamp(3rem, 14cqmin, 10rem)",
      "--weight": "400",
      "--transform": "none",
      "--letter-spacing": "0.02em",
    },
  },
  {
    id: "pixel",
    name: "Pixel",
    font: "Silkscreen",
    fontWeights: "700",
    layout: "center",
    animation: "bounce",
    decoration: "grid",
    css: {
      "--bg": "#2563eb",
      "--fg": "#ffffff",
      "--accent": "#fbbf24",
      "--size": "clamp(2rem, 10cqmin, 6rem)",
      "--weight": "700",
      "--transform": "none",
      "--letter-spacing": "0",
      "--pixelated": "1",
    },
  },
  {
    id: "luxury",
    name: "Luxury",
    font: "Cinzel",
    fontWeights: "900",
    layout: "center",
    animation: "zoom",
    decoration: "none",
    className: "theme-luxury",
    css: {
      "--bg": "#0a0a0a",
      "--fg": "#d4af37",
      "--accent": "#f5e6c8",
      "--size": "clamp(2.5rem, 10cqmin, 7rem)",
      "--weight": "900",
      "--transform": "none",
      "--letter-spacing": "0.25em",
    },
  },
  {
    id: "crayon",
    name: "Crayon",
    font: "Gochi Hand",
    fontWeights: "400",
    layout: "center",
    animation: "scatter",
    decoration: "none",
    className: "theme-crayon",
    css: {
      "--bg": "#dbeafe",
      "--fg": "#1e40af",
      "--accent": "#dc2626",
      "--size": "clamp(3rem, 12cqmin, 8rem)",
      "--weight": "400",
      "--transform": "rotate(-4deg)",
      "--letter-spacing": "0",
    },
  },
  {
    id: "scientific",
    name: "Scientific",
    font: "Source Serif 4",
    fontWeights: "400;600",
    layout: "stack",
    animation: "fade",
    decoration: "grid",
    className: "theme-scientific",
    css: {
      "--bg": "#ffffff",
      "--fg": "#1e293b",
      "--accent": "#dc2626",
      "--size": "clamp(2rem, 8cqmin, 5rem)",
      "--weight": "600",
      "--transform": "none",
      "--letter-spacing": "0",
      "--sub-size": "0.875rem",
    },
  },
  {
    id: "disco",
    name: "Disco",
    font: "Monoton",
    fontWeights: "400",
    layout: "marquee-wrap",
    animation: "marquee",
    decoration: "stars",
    css: {
      "--bg": "#1e1b4b",
      "--fg": "#f0abfc",
      "--accent": "#67e8f9",
      "--size": "clamp(2rem, 10cqmin, 6rem)",
      "--weight": "400",
      "--transform": "none",
      "--letter-spacing": "0.1em",
    },
  },
  {
    id: "typewriter",
    name: "Typewriter",
    font: "Special Elite",
    fontWeights: "400",
    layout: "center",
    animation: "typewriter",
    decoration: "none",
    className: "theme-typewriter",
    css: {
      "--bg": "#e8e4d9",
      "--fg": "#2c2416",
      "--accent": "#8b4513",
      "--size": "clamp(2.5rem, 10cqmin, 6rem)",
      "--weight": "400",
      "--transform": "none",
      "--letter-spacing": "0.02em",
    },
  },
  {
    id: "graffiti",
    name: "Graffiti",
    font: "Permanent Marker",
    fontWeights: "400",
    layout: "diagonal",
    animation: "slide-left",
    decoration: "noise",
    css: {
      "--bg": "#374151",
      "--fg": "#f97316",
      "--accent": "#22d3ee",
      "--size": "clamp(3rem, 14cqmin, 10rem)",
      "--weight": "400",
      "--transform": "rotate(-12deg)",
      "--letter-spacing": "0",
      "--text-shadow": "3px 3px 0 #0ea5e9, 6px 6px 0 #dc2626",
    },
  },
  {
    id: "minimal-swiss",
    name: "Swiss",
    font: "Inter",
    fontWeights: "100;900",
    layout: "split",
    animation: "slide-right",
    decoration: "none",
    css: {
      "--bg": "#ffffff",
      "--fg": "#ff0000",
      "--accent": "#000000",
      "--size": "clamp(5rem, 25cqmin, 18rem)",
      "--weight": "900",
      "--transform": "none",
      "--letter-spacing": "-0.06em",
    },
  },
  {
    id: "horror",
    name: "Horror",
    font: "Creepster",
    fontWeights: "400",
    layout: "center",
    animation: "float",
    decoration: "noise",
    css: {
      "--bg": "#1a0505",
      "--fg": "#991b1b",
      "--accent": "#450a0a",
      "--size": "clamp(3rem, 14cqmin, 10rem)",
      "--weight": "400",
      "--transform": "none",
      "--letter-spacing": "0.05em",
      "--text-shadow": "0 0 30px #7f1d1d",
    },
  },
  {
    id: "bubble",
    name: "Bubble",
    font: "Baloo 2",
    fontWeights: "800",
    layout: "center",
    animation: "rubber",
    decoration: "circles",
    className: "theme-bubble",
    css: {
      "--bg": "#ddd6fe",
      "--fg": "#5b21b6",
      "--accent": "#c4b5fd",
      "--size": "clamp(3rem, 14cqmin, 10rem)",
      "--weight": "800",
      "--transform": "none",
      "--letter-spacing": "0",
    },
  },
  {
    id: "blueprint",
    name: "Blueprint",
    font: "Architects Daughter",
    fontWeights: "400",
    layout: "center",
    animation: "fade",
    decoration: "grid",
    className: "theme-blueprint",
    css: {
      "--bg": "#1e3a5f",
      "--fg": "#ffffff",
      "--accent": "#93c5fd",
      "--size": "clamp(2.5rem, 10cqmin, 7rem)",
      "--weight": "400",
      "--transform": "none",
      "--letter-spacing": "0.02em",
    },
  },
  {
    id: "origami",
    name: "Origami",
    font: "Zen Maru Gothic",
    fontWeights: "700",
    layout: "center",
    animation: "flip",
    decoration: "none",
    css: {
      "--bg": "#fff1f2",
      "--fg": "#be123c",
      "--accent": "#fda4af",
      "--size": "clamp(3rem, 12cqmin, 8rem)",
      "--weight": "700",
      "--transform": "none",
      "--letter-spacing": "0.15em",
    },
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    font: "Syncopate",
    fontWeights: "700",
    layout: "diagonal",
    animation: "wave",
    decoration: "grid",
    className: "theme-vaporwave",
    css: {
      "--bg": "linear-gradient(135deg, #ff71ce 0%, #01cdfe 50%, #05ffa1 100%)",
      "--fg": "#ffffff",
      "--accent": "#b967ff",
      "--size": "clamp(2rem, 10cqmin, 6rem)",
      "--weight": "700",
      "--transform": "none",
      "--letter-spacing": "0.2em",
    },
  },
  {
    id: "handletter",
    name: "Handletter",
    font: "Pacifico",
    fontWeights: "400",
    layout: "center",
    animation: "ink",
    decoration: "none",
    css: {
      "--bg": "#fffbeb",
      "--fg": "#b45309",
      "--accent": "#fbbf24",
      "--size": "clamp(3rem, 12cqmin, 8rem)",
      "--weight": "400",
      "--transform": "rotate(-3deg)",
      "--letter-spacing": "0",
    },
  },
  {
    id: "constructivist",
    name: "Constructivist",
    font: "Oswald",
    fontWeights: "700",
    layout: "split",
    animation: "split",
    decoration: "stripes",
    css: {
      "--bg": "#ffffff",
      "--fg": "#000000",
      "--accent": "#ef4444",
      "--size": "clamp(4rem, 18cqmin, 12rem)",
      "--weight": "700",
      "--transform": "uppercase",
      "--letter-spacing": "0.02em",
    },
  },
];

const pickUniqueTheme = createDeckPicker(themes, (theme) => theme.id, "no:theme-deck");

export function pickTheme(): Theme {
  return pickUniqueTheme();
}

export function loadFonts(theme: Theme): void {
  const families: string[] = [`family=${encodeURIComponent(theme.font)}:wght@${theme.fontWeights ?? "400"}`];
  if (theme.accentFont) {
    families.push(`family=${encodeURIComponent(theme.accentFont)}:wght@${theme.accentWeights ?? "400"}`);
  }

  const id = `gf-${theme.id}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
  document.head.appendChild(link);
}
