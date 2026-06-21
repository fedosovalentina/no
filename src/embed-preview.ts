import "./embed-preview.css";
import {
  embedCopy,
  embedPhraseCount,
  getEmbedPhrase,
  pickRandomEmbedIndex,
} from "./embed-phrases";
import { detectLocaleFromNavigator } from "./locale-detect";

type TabId = "telegram" | "vk" | "discord" | "twitter" | "slack";

const locale = detectLocaleFromNavigator();
const strings = embedCopy[locale];

let phraseIndex = pickRandomEmbedIndex(locale);
let activeTab: TabId = "telegram";
let fading = false;

function phrase(): string {
  return getEmbedPhrase(locale, phraseIndex);
}

function ogCardUrl(opts: { compact?: boolean; hide?: boolean } = {}): string {
  const params = new URLSearchParams({
    lang: locale,
    i: String(phraseIndex),
  });
  if (opts.compact) params.set("compact", "1");
  if (opts.hide) params.set("hide", "1");
  return `/og.svg?${params}`;
}

function ogImageBlock(opts: { compact?: boolean; hidePhrase?: boolean } = {}): string {
  const compact = opts.compact ?? false;
  const hidePhrase = opts.hidePhrase ?? false;
  return `
    <div class="og-card ${compact ? "og-card--compact" : ""}">
      <img class="og-card__img" src="${ogCardUrl({ compact, hide: hidePhrase })}" alt="" width="100%" />
    </div>`;
}

function telegramEmbed(): string {
  return `
    <div class="embed embed--telegram">
      <div class="embed__label">Telegram</div>
      <div class="embed__card">
        ${ogImageBlock()}
        <div class="embed__footer">
          <div class="embed__site">${strings.siteLabel}</div>
          <div class="embed__title">${strings.linkTitle}</div>
        </div>
      </div>
    </div>`;
}

function vkEmbed(): string {
  return `
    <div class="embed embed--vk">
      <div class="embed__label">ВКонтакте</div>
      <div class="embed__card">
        ${ogImageBlock()}
        <div class="embed__footer">
          <div class="embed__site embed__site--muted">${strings.siteLabel}</div>
          <div class="embed__title embed__title--dark">${strings.linkTitle}</div>
        </div>
      </div>
    </div>`;
}

function discordEmbed(): string {
  return `
    <div class="embed embed--discord">
      <div class="embed__label">Discord</div>
      <div class="embed__card embed__card--discord">
        <div class="embed__discord-body">
          <div class="embed__discord-text">
            <div class="embed__site embed__site--discord">${strings.siteLabel}</div>
            <div class="embed__title embed__title--discord">${phrase()}</div>
            <div class="embed__desc">${strings.ogDescription}</div>
          </div>
          <div class="embed__discord-thumb">${ogImageBlock({ compact: true, hidePhrase: true })}</div>
        </div>
      </div>
    </div>`;
}

function twitterEmbed(): string {
  return `
    <div class="embed embed--twitter">
      <div class="embed__label">X (Twitter)</div>
      <div class="embed__card embed__card--twitter">
        ${ogImageBlock()}
        <div class="embed__footer embed__footer--twitter">
          <div class="embed__site embed__site--twitter">${strings.siteLabel}</div>
        </div>
      </div>
    </div>`;
}

function slackEmbed(): string {
  return `
    <div class="embed embed--slack">
      <div class="embed__label">Slack</div>
      <div class="embed__slack-body">
        <div class="embed__site embed__site--slack">${strings.siteLabel}</div>
        <div class="embed__title embed__title--slack">${phrase()}</div>
        <div class="embed__desc embed__desc--slack">${strings.ogDescription}</div>
        <div class="embed__slack-image">${ogImageBlock({ hidePhrase: true })}</div>
      </div>
    </div>`;
}

function renderPreview(): string {
  switch (activeTab) {
    case "telegram":
      return telegramEmbed();
    case "vk":
      return vkEmbed();
    case "discord":
      return discordEmbed();
    case "twitter":
      return twitterEmbed();
    case "slack":
      return slackEmbed();
  }
}

const tabs: { id: TabId; label: string }[] =
  locale === "ru"
    ? [
        { id: "telegram", label: "Telegram" },
        { id: "vk", label: "ВК" },
        { id: "discord", label: "Discord" },
        { id: "twitter", label: "X / Twitter" },
        { id: "slack", label: "Slack" },
      ]
    : [
        { id: "telegram", label: "Telegram" },
        { id: "vk", label: "VK" },
        { id: "discord", label: "Discord" },
        { id: "twitter", label: "X / Twitter" },
        { id: "slack", label: "Slack" },
      ];

function render(): void {
  const root = document.getElementById("embed-app")!;
  root.innerHTML = `
    <div class="embed-page">
      <div class="embed-page__kicker">${strings.previewSub}</div>
      <h1 class="embed-page__title">${strings.previewHeading}</h1>
      <p class="embed-page__phrase">${phrase()}</p>

      <div class="embed-tabs" role="tablist">
        ${tabs
          .map(
            (tab) => `
          <button type="button" class="embed-tabs__btn ${tab.id === activeTab ? "is-active" : ""}" data-tab="${tab.id}">
            ${tab.label}
          </button>`,
          )
          .join("")}
      </div>

      <div class="embed-preview ${fading ? "is-fading" : ""}">
        ${renderPreview()}
      </div>

      <button type="button" class="embed-page__shuffle" id="shuffle-btn">${strings.anotherPhrase}</button>

      <div class="embed-notes">
        <div class="embed-notes__title">${strings.platformNotes}</div>
        ${strings.platformRows
          .map(
            ([platform, note]) => `
          <div class="embed-notes__row">
            <span class="embed-notes__platform">${platform}</span>
            <span class="embed-notes__note">${note}</span>
          </div>`,
          )
          .join("")}
      </div>
    </div>`;

  root.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab as TabId;
      render();
    });
  });

  root.querySelector("#shuffle-btn")!.addEventListener("click", () => {
    randomize();
  });
}

function randomize(): void {
  fading = true;
  render();
  window.setTimeout(() => {
    phraseIndex = (phraseIndex + 1) % embedPhraseCount(locale);
    fading = false;
    render();
  }, 180);
}

render();
window.setInterval(randomize, 4000);
