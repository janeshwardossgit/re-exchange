"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, Chip } from "@/components/ui";
import { CATEGORIES, CONDITIONS, EXCHANGE_TYPES, HOSTELS } from "@/lib/constants";
import type { Category, Condition, ExchangeType } from "@/lib/types";
import { useStore } from "@/lib/store";

const STOCK = [
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1456513080800-7d93acd79315?auto=format&fit=crop&w=1400&q=80",
];

export default function CreatePage() {
  const router = useRouter();
  const { addListing } = useStore();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [type, setType] = useState<ExchangeType>("sell");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Books");
  const [price, setPrice] = useState("0");
  const [priceNote, setPriceNote] = useState("");
  const [condition, setCondition] = useState<Condition>("Good");
  const [hostel, setHostel] = useState<string>("Adhiyaman Hostel");
  const [availability, setAvailability] = useState("Weeknights after 7");
  const [preferred, setPreferred] = useState("Hostel pickup · UPI");
  const [images, setImages] = useState<string[]>([STOCK[0]]);

  const needsPrice = type === "sell" || type === "lend" || type === "skill" || type === "trade";

  const canNext = useMemo(() => {
    if (step === 0) return Boolean(type);
    if (step === 1) return title.trim().length > 3 && description.trim().length > 10;
    if (step === 2) return Boolean(hostel && availability);
    return true;
  }, [step, type, title, description, hostel, availability]);

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImages((prev) => [reader.result as string, ...prev].slice(0, 4));
    };
    reader.readAsDataURL(file);
  };

  const publish = () => {
    const parsed = needsPrice ? Number(price) : 0;
    if (needsPrice && type === "sell" && (Number.isNaN(parsed) || parsed < 0)) {
      setError("Add a fair campus price, even if it’s ₹0.");
      return;
    }
    const listing = addListing({
      title: title.trim(),
      description: description.trim(),
      category,
      exchangeType: type,
      price: type === "giveaway" ? 0 : parsed || 0,
      priceNote: priceNote || undefined,
      condition,
      location: `${hostel}`,
      hostel,
      availability,
      images: images.length ? images : [STOCK[0]],
      preferredExchange: preferred,
      featured: false,
    });
    router.push(`/listings/${listing.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs uppercase tracking-[0.2em] text-ember">Create exchange</p>
      <h1 className="display mt-1 text-4xl">List it in four unhurried steps.</h1>
      <div className="mt-6 flex gap-2">
        {["Type", "Details", "Logistics", "Review"].map((label, i) => (
          <div key={label} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-forest" : "bg-line"}`} />
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">Step {step + 1} of 4 · {["Type", "Details", "Logistics", "Review"][step]}</p>

      {error ? (
        <p className="mt-4 rounded-2xl bg-[#f3d9d4] px-4 py-3 text-sm text-[#7a2424]" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 rounded-3xl border border-line bg-card p-5 sm:p-7">
        {step === 0 && (
          <div className="grid gap-3">
            {EXCHANGE_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`rounded-2xl border p-4 text-left ${type === t.id ? "border-forest bg-[#e7f0ea]" : "border-line"}`}
              >
                <p className="font-medium">{t.label}</p>
                <p className="text-sm text-muted">{t.hint}</p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-sm">
              Title
              <input
                className="focus-ring mt-1 w-full rounded-2xl border border-line px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scientific calculator for two-day lend"
              />
            </label>
            <label className="block text-sm">
              Description
              <textarea
                className="focus-ring mt-1 min-h-28 w-full rounded-2xl border border-line px-3 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Condition, who it’s for, when they can pick it up."
              />
            </label>
            <div>
              <p className="text-sm">Category</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            </div>
            {needsPrice ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Price (₹)
                  <input
                    type="number"
                    min={0}
                    className="focus-ring mt-1 w-full rounded-2xl border border-line px-3 py-2"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </label>
                <label className="text-sm">
                  Note
                  <input
                    className="focus-ring mt-1 w-full rounded-2xl border border-line px-3 py-2"
                    value={priceNote}
                    onChange={(e) => setPriceNote(e.target.value)}
                    placeholder="/ day, / session, or leave blank"
                  />
                </label>
              </div>
            ) : (
              <p className="rounded-2xl bg-paper-2 px-3 py-2 text-sm">This will publish as free.</p>
            )}
            <label className="block text-sm">
              Condition
              <select
                className="focus-ring mt-1 w-full rounded-2xl border border-line px-3 py-2"
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
              >
                {CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-sm">
              Hostel / location
              <select
                className="focus-ring mt-1 w-full rounded-2xl border border-line px-3 py-2"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
              >
                {HOSTELS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Availability
              <input
                className="focus-ring mt-1 w-full rounded-2xl border border-line px-3 py-2"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Preferred exchange
              <input
                className="focus-ring mt-1 w-full rounded-2xl border border-line px-3 py-2"
                value={preferred}
                onChange={(e) => setPreferred(e.target.value)}
              />
            </label>
            <div>
              <p className="text-sm">Photos</p>
              <input className="mt-2 text-sm" type="file" accept="image/*" onChange={(e) => onFiles(e.target.files)} />
              <div className="mt-3 flex gap-2">
                {STOCK.map((src) => (
                  <button
                    type="button"
                    key={src}
                    onClick={() => setImages([src])}
                    className={`h-16 w-16 overflow-hidden rounded-xl border ${images[0] === src ? "border-ink" : "border-line"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              {images[0]?.startsWith("data:") ? (
                <p className="mt-2 text-xs text-muted">Using your uploaded photo.</p>
              ) : null}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm">
            <p className="display text-2xl">{title || "Untitled"}</p>
            <p className="text-muted">{EXCHANGE_TYPES.find((t) => t.id === type)?.label} · {category} · {hostel}</p>
            <p>{description}</p>
            <p className="font-medium">
              {type === "giveaway" ? "Free" : `₹${price || 0} ${priceNote}`}
            </p>
            <p className="text-muted">{condition} · {availability}</p>
            <p>Preferred: {preferred}</p>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button variant="ghost" disabled={step === 0} onClick={() => { setError(""); setStep((s) => s - 1); }}>
            Back
          </Button>
          {step < 3 ? (
            <Button
              disabled={!canNext}
              onClick={() => {
                setError("");
                if (!canNext) {
                  setError("Fill the required fields — title and a real description help the match engine.");
                  return;
                }
                setStep((s) => s + 1);
              }}
            >
              Continue
            </Button>
          ) : (
            <Button onClick={publish}>Publish listing</Button>
          )}
        </div>
      </div>
    </div>
  );
}
