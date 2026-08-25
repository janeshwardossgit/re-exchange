import type { Category, ExchangeType, Listing, User } from "./types";

const CATEGORY_HINTS: { keys: string[]; category: Category }[] = [
  { keys: ["book", "textbook", "grewal", "math", "gate", "notes", "pdf", "study"], category: "Study Material" },
  { keys: ["book", "textbook", "grewal"], category: "Books" },
  { keys: ["calc", "calculator", "charger", "laptop", "headphone", "arduino", "usb", "electronic"], category: "Electronics" },
  { keys: ["ticket", "fest", "concert", "cultural"], category: "Tickets" },
  { keys: ["hostel", "mattress", "kettle", "room"], category: "Hostel" },
  { keys: ["teach", "tutor", "python", "skill", "workshop", "speak", "design", "poster"], category: "Skills" },
  { keys: ["service", "poster", "repair"], category: "Services" },
  { keys: ["free", "give", "donate", "unused"], category: "Free Stuff" },
];

const TYPE_HINTS: { keys: string[]; type: ExchangeType }[] = [
  { keys: ["lend", "borrow", "two days", "few days", "return"], type: "lend" },
  { keys: ["teach", "tutor", "learn", "workshop"], type: "skill" },
  { keys: ["free", "give", "unused", "donate"], type: "giveaway" },
  { keys: ["trade", "swap"], type: "trade" },
  { keys: ["buy", "need", "sell", "price"], type: "sell" },
];

function tokens(q: string) {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

export function interpretQuery(query: string) {
  const t = tokens(query);
  const joined = t.join(" ");
  const categories = new Set<Category>();
  for (const hint of CATEGORY_HINTS) {
    if (hint.keys.some((k) => joined.includes(k))) categories.add(hint.category);
  }
  let type: ExchangeType | undefined;
  for (const hint of TYPE_HINTS) {
    if (hint.keys.some((k) => joined.includes(k))) {
      type = hint.type;
      break;
    }
  }
  const offering = /\b(have|unused|giving|selling)\b/.test(joined);
  const needing = /\b(need|want|looking|borrow|learn)\b/.test(joined);
  return { tokens: t, categories: [...categories], type, offering, needing };
}

export function matchListings(query: string, listings: Listing[]) {
  const parsed = interpretQuery(query);
  const scored = listings
    .filter((l) => l.status === "active")
    .map((listing) => {
      const hay = `${listing.title} ${listing.description} ${listing.category} ${listing.preferredExchange}`.toLowerCase();
      let score = 0;
      for (const tok of parsed.tokens) {
        if (hay.includes(tok)) score += 3;
      }
      if (parsed.categories.includes(listing.category)) score += 6;
      if (parsed.type && listing.exchangeType === parsed.type) score += 8;
      if (parsed.needing && (listing.exchangeType === "lend" || listing.exchangeType === "skill" || listing.exchangeType === "giveaway"))
        score += 4;
      if (parsed.offering && (listing.exchangeType === "sell" || listing.exchangeType === "giveaway")) score += 3;
      return { listing, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return { parsed, results: scored };
}

export function matchPeople(query: string, people: User[], meId: string) {
  const t = tokens(query);
  return people
    .filter((u) => u.id !== meId)
    .map((user) => {
      const hay = `${user.name} ${user.bio} ${user.skills.join(" ")} ${user.course}`.toLowerCase();
      let score = 0;
      for (const tok of t) if (hay.includes(tok)) score += 4;
      for (const skill of user.skills) {
        if (t.some((tok) => skill.toLowerCase().includes(tok))) score += 8;
      }
      return { user, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

export const SAMPLE_MATCHES = [
  "I need a scientific calculator for two days.",
  "I want someone to teach me Python.",
  "I have an unused engineering textbook.",
  "Looking for a cultural night ticket.",
  "Need a lab coat before Friday practicals.",
];
