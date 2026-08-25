"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ListingGrid } from "@/components/listing-card";
import { Avatar, Empty, StarRow } from "@/components/ui";
import { CURRENT_USER_ID } from "@/lib/data";
import { useStore, userById, allUsers } from "@/lib/store";

export default function OwnProfile() {
  return <ProfileView userId={CURRENT_USER_ID} />;
}

export function ProfileView({ userId }: { userId: string }) {
  const params = useParams<{ id?: string }>();
  const id = userId || params.id || CURRENT_USER_ID;
  const user = allUsers.find((u) => u.id === id) ?? userById(id);
  const { listings, savedIds, conversations, meId } = useStore();
  const theirs = listings.filter((l) => l.ownerId === user.id && l.status !== "paused");
  const saved = listings.filter((l) => savedIds.includes(l.id));
  const completed = conversations.filter(
    (c) => c.participantIds.includes(user.id) && c.status === "completed",
  ).length;
  const mine = user.id === meId;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 rounded-3xl border border-line bg-card p-6 sm:flex-row sm:items-center">
        <Avatar initials={user.initials} hue={user.avatarHue} size="lg" />
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-ember">{user.campus}</p>
          <h1 className="display text-4xl">{user.name}</h1>
          <p className="text-muted">
            {user.course} · {user.year} · {user.hostel}
          </p>
          <p className="mt-1">
            <StarRow rating={user.rating} /> · {user.reviews} reviews · {user.exchangesCompleted + completed} exchanges
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed">{user.bio}</p>
          {user.skills.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {user.skills.map((s) => (
                <span key={s} className="rounded-full bg-paper-2 px-3 py-1 text-xs">
                  {s}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {mine ? (
          <Link href="/dashboard" className="rounded-full bg-forest px-4 py-2 text-sm text-[#f6f1e7]">
            Open dashboard
          </Link>
        ) : null}
      </section>

      <section>
        <h2 className="display text-2xl">Listings</h2>
        <div className="mt-4">
          {theirs.length ? (
            <ListingGrid items={theirs} />
          ) : (
            <Empty title="No active listings" body="This student is browsing, not posting — for now." />
          )}
        </div>
      </section>

      {mine ? (
        <section>
          <h2 className="display text-2xl">Saved</h2>
          <div className="mt-4">
            {saved.length ? (
              <ListingGrid items={saved} />
            ) : (
              <Empty title="Nothing saved" body="Tap the heart on a card to park it here." />
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
