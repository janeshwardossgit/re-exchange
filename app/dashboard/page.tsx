"use client";

import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { Button, Empty, StatusPill } from "@/components/ui";
import { CURRENT_USER_ID, impactSeed } from "@/lib/data";
import { inr } from "@/lib/format";
import { useStore, userById } from "@/lib/store";

export default function DashboardPage() {
  const { listings, savedIds, conversations, updateListingStatus, meId } = useStore();
  const mine = listings.filter((l) => l.ownerId === meId);
  const active = mine.filter((l) => l.status === "active");
  const saved = listings.filter((l) => savedIds.includes(l.id));
  const incoming = conversations.filter(
    (c) => listings.find((l) => l.id === c.listingId)?.ownerId === meId,
  );
  const outgoing = conversations.filter(
    (c) => c.participantIds.includes(meId) && listings.find((l) => l.id === c.listingId)?.ownerId !== meId,
  );
  const completed = conversations.filter((c) => c.participantIds.includes(meId) && c.status === "completed");
  const extraSaved = completed.length * 420;
  const donated = listings.filter((l) => l.ownerId === meId && (l.exchangeType === "giveaway" || l.price === 0)).length;

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-ember">Your desk</p>
        <h1 className="display text-4xl">Dashboard</h1>
        <p className="text-muted">Listings, requests, and the reuse you accidentally caused.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Items reused" value={`${impactSeed.itemsReused + completed.length}`} />
        <Stat label="Money saved" value={inr(impactSeed.moneySaved + extraSaved)} />
        <Stat label="Successful exchanges" value={`${impactSeed.successfulExchanges + completed.length}`} />
        <Stat label="Your giveaways" value={`${donated}`} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="display text-2xl">Active listings</h2>
          <Link href="/create" className="text-sm text-forest">
            New listing
          </Link>
        </div>
        {active.length ? (
          <div className="space-y-4">
            {active.map((l) => (
              <div key={l.id} className="grid gap-3 rounded-3xl border border-line bg-card p-3 md:grid-cols-[1fr_auto] md:items-center">
                <div className="md:max-w-sm">
                  <ListingCard listing={l} />
                </div>
                <div className="flex flex-wrap gap-2 md:flex-col">
                  <Button variant="line" onClick={() => updateListingStatus(l.id, "paused")}>
                    Pause
                  </Button>
                  <Button variant="ghost" onClick={() => updateListingStatus(l.id, "completed")}>
                    Mark completed
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty title="No active listings" body="Paused or completed everything? Put something back in motion." />
        )}
      </section>

      <Requests title="Incoming requests" items={incoming} listings={listings} />
      <Requests title="Outgoing requests" items={outgoing} listings={listings} />

      <section>
        <h2 className="display mb-3 text-2xl">Saved items</h2>
        {saved.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {saved.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <Empty title="No bookmarks" body="Hearts on cards land here." />
        )}
      </section>

      <section>
        <h2 className="display mb-3 text-2xl">Completed exchanges</h2>
        {completed.length ? (
          <ul className="space-y-2">
            {completed.map((c) => {
              const listing = listings.find((l) => l.id === c.listingId);
              const other = userById(c.participantIds.find((id) => id !== CURRENT_USER_ID) ?? CURRENT_USER_ID);
              return (
                <li key={c.id} className="flex items-center justify-between rounded-2xl border border-line bg-card px-4 py-3">
                  <div>
                    <p className="font-medium">{listing?.title}</p>
                    <p className="text-xs text-muted">with {other.name}</p>
                  </div>
                  <Link href={`/messages/${c.id}`} className="text-sm text-forest">
                    Thread
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted">Complete a thread to grow the impact numbers.</p>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-line bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="display mt-1 text-3xl">{value}</p>
    </div>
  );
}

function Requests({
  title,
  items,
  listings,
}: {
  title: string;
  items: { id: string; listingId: string; status: string; participantIds: [string, string] }[];
  listings: { id: string; title: string }[];
}) {
  return (
    <section>
      <h2 className="display mb-3 text-2xl">{title}</h2>
      {items.length ? (
        <ul className="space-y-2">
          {items.map((c) => {
            const listing = listings.find((l) => l.id === c.listingId);
            const other = userById(c.participantIds.find((id) => id !== CURRENT_USER_ID) ?? CURRENT_USER_ID);
            return (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3">
                <div>
                  <p className="font-medium">{other.name}</p>
                  <p className="text-xs text-muted">{listing?.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={c.status} />
                  <Link href={`/messages/${c.id}`} className="text-sm text-forest">
                    Open
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted">Quiet for now.</p>
      )}
    </section>
  );
}
