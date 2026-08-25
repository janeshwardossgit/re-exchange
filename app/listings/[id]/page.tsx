"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ListingGrid } from "@/components/listing-card";
import { Avatar, Button, Empty, Modal, StarRow, TypeBadge } from "@/components/ui";
import { inr, relativeTime } from "@/lib/format";
import { useStore, userById } from "@/lib/store";

export default function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { listings, savedIds, toggleSave, startOrOpenChat, reportListing, reportedIds, ready } = useStore();
  const listing = listings.find((l) => l.id === id);
  const [shot, setShot] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);

  const similar = useMemo(() => {
    if (!listing) return [];
    return listings
      .filter(
        (l) =>
          l.id !== listing.id &&
          l.status === "active" &&
          (l.category === listing.category || l.exchangeType === listing.exchangeType),
      )
      .slice(0, 3);
  }, [listing, listings]);

  if (!ready) return <div className="skeleton h-[28rem] rounded-3xl" />;
  if (!listing) {
    return (
      <Empty
        title="Listing walked off campus"
        body="It may have been completed or the link is stale."
        action={
          <Link href="/" className="text-sm text-forest underline">
            Back to Discover
          </Link>
        }
      />
    );
  }

  const owner = userById(listing.ownerId);
  const saved = savedIds.includes(listing.id);
  const cover = listing.images[shot] ?? listing.images[0];

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-paper-2">
            {cover?.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" className="h-full w-full object-cover" />
            ) : cover ? (
              <Image src={cover} alt={listing.title} fill className="object-cover" sizes="60vw" />
            ) : null}
          </div>
          {listing.images.length > 1 ? (
            <div className="mt-3 flex gap-2">
              {listing.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setShot(i)}
                  className={`relative h-16 w-20 overflow-hidden rounded-xl border ${i === shot ? "border-ink" : "border-line"}`}
                >
                  {src.startsWith("data:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                  )}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={listing.exchangeType} />
            <span className="text-sm text-muted">{listing.category}</span>
            <span className="text-sm text-muted">· {relativeTime(listing.createdAt)}</span>
          </div>
          <h1 className="display mt-3 text-4xl leading-tight">{listing.title}</h1>
          <p className="display mt-4 text-3xl">
            {listing.price === 0 || listing.exchangeType === "giveaway"
              ? "Free"
              : inr(listing.price, listing.priceNote)}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/85">{listing.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-paper-2/70 p-3">
              <dt className="text-muted">Condition</dt>
              <dd className="font-medium">{listing.condition}</dd>
            </div>
            <div className="rounded-2xl bg-paper-2/70 p-3">
              <dt className="text-muted">Location</dt>
              <dd className="font-medium">{listing.location}</dd>
            </div>
            <div className="rounded-2xl bg-paper-2/70 p-3">
              <dt className="text-muted">Availability</dt>
              <dd className="font-medium">{listing.availability}</dd>
            </div>
            <div className="rounded-2xl bg-paper-2/70 p-3">
              <dt className="text-muted">Preferred exchange</dt>
              <dd className="font-medium">{listing.preferredExchange}</dd>
            </div>
          </dl>
          <Link href={`/profile/${owner.id}`} className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-card p-3">
            <Avatar initials={owner.initials} hue={owner.avatarHue} />
            <div>
              <p className="font-medium">{owner.name}</p>
              <p className="text-xs text-muted">
                {owner.course} · {owner.year} · <StarRow rating={owner.rating} /> ({owner.reviews})
              </p>
            </div>
          </Link>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                const cid = startOrOpenChat(listing.id);
                if (cid) router.push(`/messages/${cid}`);
              }}
            >
              Message
            </Button>
            <Button variant={saved ? "ember" : "line"} onClick={() => toggleSave(listing.id)}>
              {saved ? "Saved" : "Save"}
            </Button>
            <Button
              variant="ghost"
              disabled={reportedIds.includes(listing.id)}
              onClick={() => setReportOpen(true)}
            >
              {reportedIds.includes(listing.id) ? "Reported" : "Report"}
            </Button>
          </div>
        </div>
      </div>
      <section>
        <h2 className="display mb-4 text-2xl">Similar on campus</h2>
        {similar.length ? <ListingGrid items={similar} /> : <p className="text-sm text-muted">No close neighbours yet.</p>}
      </section>
      <Modal
        open={reportOpen}
        title="Report this listing?"
        body="Use this for spam, unsafe meetups, or stuff that isn’t actually on campus. Mods will hide it if needed."
        confirm="Submit report"
        tone="warn"
        onClose={() => setReportOpen(false)}
        onConfirm={() => {
          reportListing(listing.id);
          setReportOpen(false);
        }}
      />
    </div>
  );
}
