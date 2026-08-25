import type { ExchangeType } from "./types";

export function inr(n: number | null, note?: string) {
  if (n === null || n === 0) return note || "Free";
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
  return note ? `${formatted} ${note}` : formatted;
}

export function relativeTime(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  const mins = Math.round(delta / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 14) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function typeLabel(t: ExchangeType) {
  return (
    {
      sell: "Sell",
      trade: "Trade",
      giveaway: "Give away",
      lend: "Lend",
      skill: "Skill",
    } as const
  )[t];
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
