"use client";

import Image from "next/image";
import Link from "next/link";
import { inr, relativeTime, typeLabel } from "@/lib/format";
import { useStore, userById } from "@/lib/store";
import type { Listing } from "@/lib/types";
import { Avatar, TypeBadge, cn } from "./ui";

export function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const { savedIds, toggleSave } = useStore();
  const owner = userById(listing.ownerId);
  const saved = savedIds.includes(listing.id);
  const cover = listing.images[0];

  return (
    <article
      className="rise group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-[var(--shadow)]"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <Link href={`/listings/${listing.id}`} className="relative block aspect-[4/3] overflow-hidden bg-paper-2">
        {cover?.startsWith("data:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : cover ? (
          <Image
            src={cover}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">No photo</div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <TypeBadge type={listing.exchangeType} />
        </div>
      </Link>
      <button
        type="button"
        aria-label={saved ? "Unsave" : "Save"}
        onClick={() => toggleSave(listing.id)}
        className={cn(
          "absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full border text-sm",
          saved ? "border-ember bg-ember text-white" : "border-white/70 bg-white/90 text-ink",
        )}
      >
        {saved ? "♥" : "♡"}
      </button>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted">
          {listing.category} · {listing.hostel}
        </p>
        <Link href={`/listings/${listing.id}`} className="mt-1 line-clamp-2 font-medium leading-snug hover:text-forest">
          {listing.title}
        </Link>
        <p className="mt-2 display text-xl">
          {listing.exchangeType === "giveaway" || listing.price === 0
            ? "Free"
            : inr(listing.price, listing.priceNote)}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
          <span className="flex items-center gap-2">
            <Avatar initials={owner.initials} hue={owner.avatarHue} size="sm" />
            {owner.name}
          </span>
          <span>{relativeTime(listing.createdAt)}</span>
        </div>
        <p className="sr-only">{typeLabel(listing.exchangeType)}</p>
      </div>
    </article>
  );
}

export function ListingGrid({ items }: { items: Listing[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((l, i) => (
        <ListingCard key={l.id} listing={l} index={i} />
      ))}
    </div>
  );
}
