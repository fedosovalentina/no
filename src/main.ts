import "./style.css";
import { pickPhrase, pickRefreshLabel, applyPageCopy, copy } from "./locale";
import type { Phrase } from "./phrase";
import { pickTheme, loadFonts, type Theme, type AnimationId } from "./themes";
import { recordDecline, showDeclineCount } from "./counter";

const app = document.getElementById("app")!;

applyPageCopy();

const refreshBtn = document.createElement("button");
refreshBtn.type = "button";
refreshBtn.className = "refresh-btn";
refreshBtn.addEventListener("click", () => {
  void render();
});

function applyThemeVars(theme: Theme): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.css)) {
    root.style.setProperty(key, value);
  }
  root.style.setProperty("--font-family", `"${theme.font}", system-ui, sans-serif`);
  if (theme.accentFont) {
    root.style.setProperty("--accent-font", `"${theme.accentFont}", serif`);
  }
}

function animationClass(id: AnimationId): string {
  const map: Record<AnimationId, string> = {
    none: "",
    fade: "anim-fade",
    shake: "anim-shake",
    pulse: "anim-pulse",
    bounce: "anim-bounce",
    "slide-up": "anim-slide-up",
    "slide-down": "anim-slide-down",
    "slide-left": "anim-slide-left",
    "slide-right": "anim-slide-right",
    "rotate-in": "anim-rotate-in",
    flip: "anim-flip",
    glitch: "anim-glitch",
    typewriter: "anim-typewriter",
    zoom: "anim-zoom",
    "blur-in": "anim-blur-in",
    swing: "anim-swing",
    rubber: "anim-rubber",
    float: "anim-float",
    strobe: "anim-strobe",
    marquee: "anim-marquee",
    wave: "anim-wave",
    scatter: "anim-scatter",
    split: "anim-split",
    ink: "anim-ink",
    stamp: "anim-stamp",
  };
  return map[id];
}

function decorationEl(type: Theme["decoration"]): HTMLElement | null {
  if (!type || type === "none") return null;
  const el = document.createElement("div");
  el.className = `deco deco-${type}`;
  el.setAttribute("aria-hidden", "true");
  return el;
}

function wrapChars(text: string, className: string): string {
  return [...text]
    .map((char, i) => {
      const display = char === " " ? "\u00A0" : char;
      return `<span class="${className}" style="--i:${i}">${display}</span>`;
    })
    .join("");
}

function buildPhraseHtml(phrase: Phrase, theme: Theme): string {
  const anim = theme.animation;
  const useChars = anim === "wave" || anim === "scatter";
  const useGlitch = anim === "glitch" || theme.id === "glitch";
  const useTypewriter = anim === "typewriter";

  let mainContent: string;
  if (useChars) {
    mainContent = wrapChars(phrase.text, "char");
  } else {
    mainContent = phrase.text;
  }

  const glitchWrap = useGlitch ? "glitch-wrap" : "";
  const typewriterWrap = useTypewriter ? "typewriter-wrap" : "";
  const animCls = animationClass(anim);
  const cursorCls = useTypewriter ? "phrase-cursor" : "";
  const strokeCls = theme.id === "comic" ? "text-stroke" : "";
  const glowCls = theme.id === "neon" ? "text-glow" : "";

  const twSteps = phrase.text.length;
  const twStyle = useTypewriter
    ? `style="--tw-steps:${twSteps};--tw-duration:${Math.max(0.8, twSteps * 0.12)}s"`
    : "";

  const dataText = useGlitch ? `data-text="${phrase.text}"` : "";

  let html = `<div class="phrase-block ${animCls} ${glitchWrap} ${typewriterWrap}">`;
  html += `<div class="phrase-main ${strokeCls} ${glowCls} ${cursorCls}" ${dataText} ${twStyle}>${mainContent}</div>`;
  if (phrase.sub) {
    html += `<div class="phrase-sub">${phrase.sub}</div>`;
  }
  html += `</div>`;
  return html;
}

function layoutInnerClass(layout: Theme["layout"]): string {
  return `layout-${layout}`;
}

async function render(): Promise<void> {
  const phrase = pickPhrase();
  const theme = pickTheme();

  await loadFonts(theme);
  applyThemeVars(theme);

  document.title = phrase.text.slice(0, 30);
  document.documentElement.style.setProperty("--page-bg", theme.css["--page-bg"] ?? "#121212");

  const themeCls = theme.className ?? "";
  const pixelCls = theme.css["--pixelated"] ? "pixelated" : "";

  app.className = `${themeCls} ${pixelCls}`.trim();

  let stack = app.querySelector<HTMLElement>(".no-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "no-stack";
    app.appendChild(stack);
  }

  stack.querySelector(".no-card")?.remove();

  const card = document.createElement("div");
  card.className = `no-card ${layoutInnerClass(theme.layout)}`;

  const deco = decorationEl(theme.decoration);
  if (deco) card.appendChild(deco);

  const wrapper = document.createElement("div");
  wrapper.innerHTML = buildPhraseHtml(phrase, theme);
  card.appendChild(wrapper.firstElementChild!);

  if (refreshBtn.parentElement === stack) {
    stack.insertBefore(card, refreshBtn);
  } else {
    stack.appendChild(card);
    stack.appendChild(refreshBtn);
  }

  refreshBtn.textContent = pickRefreshLabel();
  refreshBtn.setAttribute("aria-label", copy.refreshAria);

  void recordDecline().then(showDeclineCount);
}

render();

// Easter egg: spacebar also refreshes the vibe
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !e.repeat) {
    e.preventDefault();
    void render();
  }
});
