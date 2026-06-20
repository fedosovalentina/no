function shuffle<T>(items: T[]): T[] {
  const deck = [...items];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function createDeckPicker<T>(
  items: T[],
  key: (item: T) => string,
  storageKey: string,
): () => T {
  let deck: string[] = [];
  let lastKey: string | null = null;

  function validKeys(): Set<string> {
    return new Set(items.map(key));
  }

  function loadDeck(): void {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const allowed = validKeys();
        deck = (JSON.parse(raw) as string[]).filter((k) => allowed.has(k));
        if (deck.length > 0) return;
      }
    } catch {
      /* ignore corrupt storage */
    }
    refillDeck();
  }

  function saveDeck(): void {
    sessionStorage.setItem(storageKey, JSON.stringify(deck));
  }

  function refillDeck(): void {
    deck = shuffle(items.map(key));
    if (items.length > 1 && lastKey && deck[deck.length - 1] === lastKey) {
      const swapWith = deck.findIndex((k) => k !== lastKey);
      if (swapWith >= 0) {
        [deck[deck.length - 1], deck[swapWith]] = [deck[swapWith], deck[deck.length - 1]];
      }
    }
    saveDeck();
  }

  loadDeck();

  return () => {
    if (deck.length === 0) refillDeck();

    const pickedKey = deck.pop()!;
    saveDeck();
    lastKey = pickedKey;

    const item = items.find((entry) => key(entry) === pickedKey);
    return item ?? items[0];
  };
}
