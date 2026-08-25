export type Category =
  | "Books"
  | "Electronics"
  | "Study Material"
  | "Tickets"
  | "Hostel"
  | "Skills"
  | "Services"
  | "Free Stuff"
  | "Other";

export type ExchangeType = "sell" | "trade" | "giveaway" | "lend" | "skill";
export type Condition = "New" | "Like new" | "Good" | "Fair" | "Digital";
export type RequestStatus = "new" | "negotiating" | "accepted" | "completed" | "declined";

export type User = {
  id: string;
  name: string;
  course: string;
  year: string;
  campus: string;
  hostel: string;
  rating: number;
  reviews: number;
  bio: string;
  skills: string[];
  exchangesCompleted: number;
  avatarHue: number;
  initials: string;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  category: Category;
  exchangeType: ExchangeType;
  price: number | null;
  priceNote?: string;
  condition: Condition;
  location: string;
  hostel: string;
  availability: string;
  images: string[];
  preferredExchange: string;
  ownerId: string;
  createdAt: string;
  featured?: boolean;
  views: number;
  savedCount: number;
  status: "active" | "paused" | "completed";
};

export type Message = {
  id: string;
  fromId: string;
  text: string;
  at: string;
};

export type Conversation = {
  id: string;
  listingId: string;
  participantIds: [string, string];
  status: RequestStatus;
  lastAt: string;
  messages: Message[];
};

export type Toast = {
  id: string;
  title: string;
  body?: string;
  tone?: "ok" | "warn" | "err";
};
