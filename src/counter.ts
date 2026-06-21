import { copy } from "./locale";

export async function recordDecline(): Promise<number | null> {
  try {
    const res = await fetch("/api/declined", { method: "POST" });
    if (!res.ok) return null;
    const data = (await res.json()) as { count: number };
    return data.count;
  } catch {
    return null;
  }
}

export function showDeclineCount(count: number | null): void {
  const el = document.getElementById("declined-count");
  if (!el) return;
  el.textContent = count !== null ? count.toLocaleString(copy.numberLocale) : "—";
}
