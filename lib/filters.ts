import type { Category, ExchangeType, Listing } from "./types";

export function filterListings(
  listings: Listing[],
  opts: {
    q?: string;
    category?: string;
    hostel?: string;
    price?: string;
    type?: string;
  },
) {
  const q = opts.q?.trim().toLowerCase() ?? "";
  return listings.filter((l) => {
    if (l.status !== "active") return false;
    if (opts.category && opts.category !== "all" && l.category !== (opts.category as Category)) return false;
    if (opts.hostel && opts.hostel !== "all" && l.hostel !== opts.hostel) return false;
    if (opts.type && opts.type !== "all" && l.exchangeType !== (opts.type as ExchangeType)) return false;
    if (opts.price && opts.price !== "any") {
      const p = l.price ?? 0;
      if (opts.price === "free" && p > 0 && l.exchangeType !== "giveaway") return false;
      if (opts.price === "under500" && (p === 0 || p >= 500)) return false;
      if (opts.price === "500-1500" && (p < 500 || p > 1500)) return false;
      if (opts.price === "1500plus" && p < 1500) return false;
    }
    if (q) {
      const hay = `${l.title} ${l.description} ${l.category} ${l.location}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
