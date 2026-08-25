"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Avatar, Button, Empty, StatusPill } from "@/components/ui";
import { relativeTime } from "@/lib/format";
import { CURRENT_USER_ID } from "@/lib/data";
import { useStore, userById } from "@/lib/store";

function otherId(ids: [string, string]) {
  return ids[0] === CURRENT_USER_ID ? ids[1] : ids[0];
}

export default function MessagesIndex() {
  return <Inbox />;
}

export function Inbox({ activeId }: { activeId?: string }) {
  const { conversations, listings, sendMessage, setConversationStatus, meId } = useStore();
  const router = useRouter();
  const sorted = useMemo(
    () => [...conversations].sort((a, b) => +new Date(b.lastAt) - +new Date(a.lastAt)),
    [conversations],
  );
  const selected = sorted.find((c) => c.id === activeId) ?? (activeId ? undefined : sorted[0]);

  return (
    <div className="grid min-h-[70vh] overflow-hidden rounded-3xl border border-line bg-card lg:grid-cols-[20rem_1fr]">
      <aside className="border-b border-line lg:border-r lg:border-b-0">
        <div className="border-b border-line px-4 py-3">
          <h1 className="display text-2xl">Messages</h1>
          <p className="text-xs text-muted">Requests that actually live on campus.</p>
        </div>
        {sorted.length ? (
          <ul>
            {sorted.map((c) => {
              const other = userById(otherId(c.participantIds));
              const listing = listings.find((l) => l.id === c.listingId);
              const last = c.messages[c.messages.length - 1];
              return (
                <li key={c.id}>
                  <Link
                    href={`/messages/${c.id}`}
                    className={`block border-b border-line px-4 py-3 hover:bg-paper ${selected?.id === c.id ? "bg-paper" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{other.name}</p>
                      <StatusPill status={c.status} />
                    </div>
                    <p className="truncate text-xs text-muted">{listing?.title}</p>
                    <p className="truncate text-sm">{last?.text}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="p-4 text-sm text-muted">No threads yet. Message a listing.</p>
        )}
      </aside>
      <section className="flex min-h-[28rem] flex-col">
        {selected ? (
          <Thread
            conversationId={selected.id}
            meId={meId}
            onSend={sendMessage}
            onStatus={setConversationStatus}
          />
        ) : (
          <div className="grid flex-1 place-items-center p-6">
            <Empty
              title="Pick a thread"
              body="Or start one from a listing — every Message button opens a real conversation."
              action={
                <Button variant="line" onClick={() => router.push("/")}>
                  Discover
                </Button>
              }
            />
          </div>
        )}
      </section>
    </div>
  );
}

function Thread({
  conversationId,
  meId,
  onSend,
  onStatus,
}: {
  conversationId: string;
  meId: string;
  onSend: (id: string, text: string) => void;
  onStatus: (id: string, status: "new" | "negotiating" | "accepted" | "completed" | "declined") => void;
}) {
  const { conversations, listings } = useStore();
  const c = conversations.find((x) => x.id === conversationId);
  const [text, setText] = useState("");
  if (!c) return <p className="p-6 text-sm text-muted">Thread missing.</p>;
  const other = userById(otherId(c.participantIds));
  const listing = listings.find((l) => l.id === c.listingId);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(c.id, text);
    setText("");
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar initials={other.initials} hue={other.avatarHue} size="sm" />
          <div>
            <Link href={`/profile/${other.id}`} className="font-medium hover:text-forest">
              {other.name}
            </Link>
            <p className="text-xs text-muted">
              {listing ? (
                <Link href={`/listings/${listing.id}`} className="underline-offset-2 hover:underline">
                  {listing.title}
                </Link>
              ) : (
                "Listing"
              )}
            </p>
          </div>
        </div>
        <StatusPill status={c.status} />
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {c.messages.map((m) => {
          const mine = m.fromId === meId;
          return (
            <div key={m.id} className={`max-w-[85%] ${mine ? "ml-auto" : ""}`}>
              <div className={`rounded-2xl px-3 py-2 text-sm ${mine ? "bg-forest text-[#f6f1e7]" : "bg-paper-2"}`}>
                {m.text}
              </div>
              <p className="mt-1 text-[11px] text-muted">{relativeTime(m.at)}</p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-2">
        <Button variant="line" onClick={() => onStatus(c.id, "accepted")}>
          Accept
        </Button>
        <Button variant="line" onClick={() => onStatus(c.id, "completed")}>
          Mark completed
        </Button>
        <Button variant="ghost" onClick={() => onStatus(c.id, "declined")}>
          Decline
        </Button>
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t border-line p-3">
        <input
          className="focus-ring flex-1 rounded-full border border-line px-4 py-2 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a campus-polite message…"
        />
        <Button type="submit">Send</Button>
      </form>
    </>
  );
}
