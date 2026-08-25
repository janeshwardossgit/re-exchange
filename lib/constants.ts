import type { Category, ExchangeType } from "./types";

export const CAMPUS = "SRM Institute of Technology, Chennai";

export const HOSTELS = [
  "Ganga Hostel",
  "Yamuna Hostel",
  "Narmada Hostel",
  "Krishna Hostel",
  "Faculty / Staff quarters",
  "Off-campus",
] as const;

export const CATEGORIES: Category[] = [
  "Books",
  "Electronics",
  "Study Material",
  "Tickets",
  "Hostel",
  "Skills",
  "Services",
  "Free Stuff",
  "Other",
];

export const EXCHANGE_TYPES: {
  id: ExchangeType;
  label: string;
  hint: string;
}[] = [
  { id: "sell", label: "Sell", hint: "Fair campus price, no shipping drama" },
  { id: "trade", label: "Trade", hint: "Swap for notes, gear, or a favour" },
  { id: "giveaway", label: "Give away", hint: "Free. Keep it circulating." },
  { id: "lend", label: "Lend", hint: "Borrow for a lab, exam, or weekend" },
  { id: "skill", label: "Skill / service", hint: "Tutor, design, repair, teach" },
];

export const CONDITIONS = ["New", "Like new", "Good", "Fair", "Digital"] as const;

export const PRICE_BUCKETS = [
  { id: "any", label: "Any price" },
  { id: "free", label: "Free" },
  { id: "under500", label: "Under ₹500" },
  { id: "500-1500", label: "₹500–1,500" },
  { id: "1500plus", label: "₹1,500+" },
] as const;
