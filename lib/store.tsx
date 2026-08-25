"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  conversations as seedConversations,
  CURRENT_USER_ID,
  listings as seedListings,
  users as seedUsers,
} from "@/lib/data";
import { uid } from "@/lib/format";
import type {
  Conversation,
  Listing,
  RequestStatus,
  Toast,
} from "@/lib/types";

const KEY = "re-exchange-v1";

type Persist = {
  listings: Listing[];
  savedIds: string[];
  conversations: Conversation[];
  reportedIds: string[];
};

type NewListing = Omit<Listing, "id" | "createdAt" | "views" | "savedCount" | "status" | "ownerId">;

type Store = {
  ready: boolean;
  meId: string;
  listings: Listing[];
  savedIds: string[];
  conversations: Conversation[];
  toasts: Toast[];
  reportedIds: string[];
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  toggleSave: (listingId: string) => void;
  addListing: (data: NewListing) => Listing;
  updateListingStatus: (id: string, status: Listing["status"]) => void;
  startOrOpenChat: (listingId: string, firstText?: string) => string;
  sendMessage: (conversationId: string, text: string) => void;
  setConversationStatus: (id: string, status: RequestStatus) => void;
  reportListing: (id: string) => void;
};

const Ctx = createContext<Store | null>(null);

function load(): Persist | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persist;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [savedIds, setSavedIds] = useState<string[]>(["l-calc", "l-workshop"]);
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const [reportedIds, setReportedIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const persisted = load();
    if (persisted) {
      const seedIds = new Set(seedListings.map((l) => l.id));
      const custom = persisted.listings.filter((l) => !seedIds.has(l.id));
      const seeded = seedListings.map((s) => {
        const over = persisted.listings.find((l) => l.id === s.id);
        return over ? { ...s, ...over, images: s.images } : s;
      });
      setListings([...custom, ...seeded]);
      setSavedIds(persisted.savedIds ?? ["l-calc", "l-workshop"]);
      const seedC = new Set(seedConversations.map((c) => c.id));
      const extra = (persisted.conversations ?? []).filter((c) => !seedC.has(c.id));
      const mergedConv = seedConversations.map((s) => {
        const over = persisted.conversations?.find((c) => c.id === s.id);
        return over ?? s;
      });
      setConversations([...extra, ...mergedConv]);
      setReportedIds(persisted.reportedIds ?? []);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const payload: Persist = { listings, savedIds, conversations, reportedIds };
    localStorage.setItem(KEY, JSON.stringify(payload));
  }, [ready, listings, savedIds, conversations, reportedIds]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = uid("t");
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const toggleSave = useCallback(
    (listingId: string) => {
      setSavedIds((prev) => {
        const on = prev.includes(listingId);
        toast({
          title: on ? "Removed from saved" : "Saved to your board",
          body: on ? "You can always find it from Discover." : "Open Dashboard → Saved to revisit.",
        });
        return on ? prev.filter((id) => id !== listingId) : [listingId, ...prev];
      });
    },
    [toast],
  );

  const addListing = useCallback(
    (data: NewListing) => {
      const listing: Listing = {
        ...data,
        id: uid("l"),
        ownerId: CURRENT_USER_ID,
        createdAt: new Date().toISOString(),
        views: 1,
        savedCount: 0,
        status: "active",
      };
      setListings((prev) => [listing, ...prev]);
      toast({ title: "Listing is live", body: "It’s on Discover for Aether students." });
      return listing;
    },
    [toast],
  );

  const updateListingStatus = useCallback((id: string, status: Listing["status"]) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const startOrOpenChat = useCallback(
    (listingId: string, firstText?: string) => {
      const listing = listings.find((l) => l.id === listingId);
      if (!listing) return "";
      if (listing.ownerId === CURRENT_USER_ID) {
        toast({ title: "That’s your listing", body: "Wait for incoming requests in Messages.", tone: "warn" });
        const existingMine = conversations.find(
          (c) => c.listingId === listingId && c.participantIds.includes(CURRENT_USER_ID),
        );
        return existingMine?.id ?? "";
      }
      const existing = conversations.find(
        (c) =>
          c.listingId === listingId &&
          c.participantIds.includes(CURRENT_USER_ID) &&
          c.participantIds.includes(listing.ownerId),
      );
      if (existing) {
        if (firstText) {
          const msg = {
            id: uid("m"),
            fromId: CURRENT_USER_ID,
            text: firstText,
            at: new Date().toISOString(),
          };
          setConversations((prev) =>
            prev.map((c) =>
              c.id === existing.id
                ? { ...c, lastAt: msg.at, messages: [...c.messages, msg], status: c.status === "completed" ? c.status : "negotiating" }
                : c,
            ),
          );
        }
        return existing.id;
      }
      const id = uid("c");
      const now = new Date().toISOString();
      const convo: Conversation = {
        id,
        listingId,
        participantIds: [CURRENT_USER_ID, listing.ownerId],
        status: "new",
        lastAt: now,
        messages: firstText
          ? [{ id: uid("m"), fromId: CURRENT_USER_ID, text: firstText, at: now }]
          : [
              {
                id: uid("m"),
                fromId: CURRENT_USER_ID,
                text: `Hi ${seedUsers.find((u) => u.id === listing.ownerId)?.name ?? ""}, is “${listing.title}” still available?`,
                at: now,
              },
            ],
      };
      setConversations((prev) => [convo, ...prev]);
      toast({ title: "Request sent", body: "They’ll see it under Incoming." });
      return id;
    },
    [conversations, listings, toast],
  );

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const at = new Date().toISOString();
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastAt: at,
              status: c.status === "new" ? "negotiating" : c.status,
              messages: [...c.messages, { id: uid("m"), fromId: CURRENT_USER_ID, text: trimmed, at }],
            }
          : c,
      ),
    );
  }, []);

  const setConversationStatus = useCallback((id: string, status: RequestStatus) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    if (status === "completed") {
      const conv = conversations.find((c) => c.id === id);
      if (conv) {
        setListings((prev) =>
          prev.map((l) => (l.id === conv.listingId ? { ...l, status: "completed" } : l)),
        );
      }
    }
  }, [conversations]);

  const reportListing = useCallback(
    (id: string) => {
      setReportedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      toast({ title: "Report received", body: "Campus mods will review this listing.", tone: "warn" });
    },
    [toast],
  );

  const value = useMemo(
    () => ({
      ready,
      meId: CURRENT_USER_ID,
      listings,
      savedIds,
      conversations,
      toasts,
      reportedIds,
      toast,
      dismissToast,
      toggleSave,
      addListing,
      updateListingStatus,
      startOrOpenChat,
      sendMessage,
      setConversationStatus,
      reportListing,
    }),
    [
      ready,
      listings,
      savedIds,
      conversations,
      toasts,
      reportedIds,
      toast,
      dismissToast,
      toggleSave,
      addListing,
      updateListingStatus,
      startOrOpenChat,
      sendMessage,
      setConversationStatus,
      reportListing,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside AppProvider");
  return ctx;
}

export function userById(id: string) {
  return seedUsers.find((u) => u.id === id) ?? seedUsers[0];
}

export { seedUsers as allUsers };
