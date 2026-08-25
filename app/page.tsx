"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ListingGrid } from "@/components/listing-card";
import { Chip, Empty } from "@/components/ui";
import { CATEGORIES, EXCHANGE_TYPES, HOSTELS, PRICE_BUCKETS } from "@/lib/constants";
import { filterListings } from "@/lib/filters";
import { inr } from "@/lib/format";
import { impactSeed } from "@/lib/data";
import { useStore } from "@/lib/store";

function DiscoverInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { listings, savedIds, ready } = useStore();
  const [draft, setDraft] = useState(params.get("q") ?? "");

  const filters = {
    q: params.get("q") ?? "",
    category: params.get("category") ?? "all",
    hostel: params.get("hostel") ?? "all",
    price: params.get("price") ?? "any",
    type: params.get("type") ?? "all",
  };

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all" || value === "any") next.delete(key);
    else next.set(key, value);
    router.replace(`/?${next.toString()}`, { scroll: false });
  };

  const filtered = useMemo(() => filterListings(listings, filters), [listings, filters]);
  const featured = listings.filter((l) => l.featured && l.status === "active").slice(0, 4);
  const recent = [...listings]
    .filter((l) => l.status === "active")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);
  const savedCats = new Set(
    listings.filter((l) => savedIds.includes(l.id)).map((l) => l.category),
  );
  const recommended = listings
    .filter((l) => l.status === "active" && (savedCats.has(l.category) || l.featured) && !savedIds.includes(l.id))
    .slice(0, 6);

  const searching = Boolean(filters.q || (filters.category !== "all") || filters.hostel !== "all" || filters.price !== "any" || filters.type !== "all");

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <p className="text-xs font-medium tracking-[0.22em] text-ember uppercase">Aether campus only</p>
          <h1 className="display mt-2 max-w-xl text-4xl leading-[1.1] sm:text-5xl">
            Unused campus value, put back into motion.
          </h1>
          <p className="mt-4 max-w-lg text-muted">
            Sell, trade, lend, give away, and teach — without leaving the gates. Built for hostels, labs, and last-minute mid-sems.
          </p>
        </div>
        <Link
          href="/impact"
          className="rounded-3xl border border-line bg-card p-5 shadow-[var(--shadow)]"
        >
          <p className="text-xs uppercase tracking-widest text-muted">Exchange impact</p>
          <p className="display mt-2 text-3xl">{impactSeed.itemsReused} items reused</p>
          <p className="mt-1 text-sm text-muted">
            {inr(impactSeed.moneySaved)} kept in student pockets this semester.
          </p>
        </Link>
      </section>

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setParam("q", draft);
        }}
      >
        <label className="sr-only" htmlFor="search">
          Search listings
        </label>
        <input
          id="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search calculators, notes, tickets, Python…"
          className="focus-ring h-12 flex-1 rounded-full border border-line bg-card px-5 text-sm"
        />
        <button type="submit" className="h-12 rounded-full bg-forest px-6 text-sm font-medium text-[#f6f1e7]">
          Search
        </button>
      </form>

      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={filters.category === "all"} onClick={() => setParam("category", "all")}>
            All
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={filters.category === c} onClick={() => setParam("category", c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="focus-ring rounded-full border border-line bg-card px-3 py-2 text-sm"
            value={filters.hostel}
            onChange={(e) => setParam("hostel", e.target.value)}
            aria-label="Hostel"
          >
            <option value="all">Any hostel</option>
            {HOSTELS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <select
            className="focus-ring rounded-full border border-line bg-card px-3 py-2 text-sm"
            value={filters.price}
            onChange={(e) => setParam("price", e.target.value)}
            aria-label="Price"
          >
            {PRICE_BUCKETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <select
            className="focus-ring rounded-full border border-line bg-card px-3 py-2 text-sm"
            value={filters.type}
            onChange={(e) => setParam("type", e.target.value)}
            aria-label="Exchange type"
          >
            <option value="all">Any exchange</option>
            {EXCHANGE_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-72 rounded-3xl" />
          ))}
        </div>
      ) : searching ? (
        <section>
          <h2 className="display text-2xl">{filtered.length} matches</h2>
          <p className="mb-4 text-sm text-muted">Live campus inventory. No shipping, no strangers from the city.</p>
          {filtered.length ? (
            <ListingGrid items={filtered} />
          ) : (
            <Empty
              title="Nothing in the hostel ether"
              body="Try another category, drop the price filter, or ask Campus Match in plain English."
              action={
                <Link href="/match" className="text-sm font-medium text-forest underline">
                  Open Campus Match
                </Link>
              }
            />
          )}
        </section>
      ) : (
        <>
          <section>
            <div className="mb-4 flex items-end justify-between">
              <h2 className="display text-2xl">Featured this week</h2>
              <Link href="/match" className="text-sm text-forest">
                Ask Match →
              </Link>
            </div>
            <ListingGrid items={featured} />
          </section>
          <section>
            <h2 className="display mb-4 text-2xl">Recommended for you</h2>
            <ListingGrid items={recommended.length ? recommended : recent} />
          </section>
          <section>
            <h2 className="display mb-4 text-2xl">Recently added</h2>
            <ListingGrid items={recent} />
          </section>
        </>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="skeleton h-96 rounded-3xl" />}>
      <DiscoverInner />
    </Suspense>
  );
}
