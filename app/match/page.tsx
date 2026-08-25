"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { Avatar, Button, Empty, StarRow } from "@/components/ui";
import { typeLabel } from "@/lib/format";
import { matchListings, matchPeople, SAMPLE_MATCHES } from "@/lib/match";
import { allUsers, useStore } from "@/lib/store";

export default function MatchPage() {
  const router = useRouter();
  const { listings, startOrOpenChat, meId } = useStore();
  const [query, setQuery] = useState(SAMPLE_MATCHES[0]);
  const [submitted, setSubmitted] = useState(SAMPLE_MATCHES[0]);

  const { parsed, results } = useMemo(() => matchListings(submitted, listings), [submitted, listings]);
  const people = useMemo(() => matchPeople(submitted, allUsers, meId), [submitted, meId]);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-ember">Campus Match</p>
        <h1 className="display mt-1 max-w-2xl text-4xl sm:text-5xl">
          Say what you need. We’ll rummage the hostel for you.
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Demo matching — keyword + intent scoring over live listings. No API key, still feels like a concierge.
        </p>
      </header>

      <form
        className="rounded-3xl border border-line bg-card p-4 shadow-[var(--shadow)]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!query.trim()) return;
          setSubmitted(query.trim());
        }}
      >
        <textarea
          className="focus-ring min-h-24 w-full resize-y rounded-2xl border border-line bg-paper px-4 py-3 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try “I need a scientific calculator for two days.”'
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {SAMPLE_MATCHES.map((s) => (
            <button
              key={s}
              type="button"
              className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:text-ink"
              onClick={() => {
                setQuery(s);
                setSubmitted(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <Button className="mt-4" type="submit">
          Find matches
        </Button>
      </form>

      <section className="flex flex-wrap gap-2 text-sm">
        {parsed.categories.map((c) => (
          <span key={c} className="rounded-full bg-paper-2 px-3 py-1">
            {c}
          </span>
        ))}
        {parsed.type ? (
          <span className="rounded-full bg-[#e7f0ea] px-3 py-1 text-forest">{typeLabel(parsed.type)}</span>
        ) : null}
        {parsed.needing ? <span className="rounded-full bg-paper-2 px-3 py-1">Need</span> : null}
        {parsed.offering ? <span className="rounded-full bg-paper-2 px-3 py-1">Have</span> : null}
      </section>

      <section>
        <h2 className="display text-2xl">Matching listings</h2>
        {results.length ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.slice(0, 6).map((r, i) => (
              <div key={r.listing.id}>
                <p className="mb-2 text-xs text-muted">Match score {r.score}</p>
                <ListingCard listing={r.listing} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <Empty
            title="Match engine shrugged"
            body="Try a shorter ask — calculator, Python, ticket, lab coat — or browse Discover."
            action={
              <Link href="/" className="text-sm text-forest underline">
                Discover
              </Link>
            }
          />
        )}
      </section>

      {people.length ? (
        <section>
          <h2 className="display text-2xl">People who can help</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {people.map(({ user, score }) => (
              <div key={user.id} className="flex items-center gap-3 rounded-3xl border border-line bg-card p-4">
                <Avatar initials={user.initials} hue={user.avatarHue} />
                <div className="min-w-0 flex-1">
                  <Link href={`/profile/${user.id}`} className="font-medium hover:text-forest">
                    {user.name}
                  </Link>
                  <p className="truncate text-xs text-muted">
                    {user.skills.join(" · ") || user.course} · <StarRow rating={user.rating} /> · score {score}
                  </p>
                </div>
                <Button
                  variant="line"
                  onClick={() => {
                    const skillListing = listings.find((l) => l.ownerId === user.id && l.exchangeType === "skill");
                    const fallback = listings.find((l) => l.ownerId === user.id);
                    const target = skillListing ?? fallback;
                    if (!target) {
                      router.push(`/profile/${user.id}`);
                      return;
                    }
                    const cid = startOrOpenChat(target.id, submitted);
                    if (cid) router.push(`/messages/${cid}`);
                  }}
                >
                  Ping
                </Button>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
