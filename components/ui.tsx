"use client";

import Link from "next/link";
import { useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useStore } from "@/lib/store";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "ember" | "line";
}) {
  const styles = {
    primary: "bg-forest text-[#f6f1e7] hover:bg-leaf",
    ember: "bg-ember text-[#fff7f2] hover:opacity-90",
    ghost: "bg-transparent hover:bg-paper-2 text-ink",
    line: "bg-card border border-line hover:border-ink/30 text-ink",
  }[variant];
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition disabled:opacity-40",
        styles,
        className,
      )}
      {...props}
    />
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition",
        active
          ? "border-forest bg-forest text-[#f6f1e7]"
          : "border-line bg-card text-ink hover:border-ink/30",
      )}
    >
      {children}
    </button>
  );
}

export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-card px-6 py-14 text-center">
      <p className="display text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Modal({
  open,
  title,
  body,
  confirm,
  cancel,
  onClose,
  onConfirm,
  tone = "ok",
}: {
  open: boolean;
  title: string;
  body: string;
  confirm: string;
  cancel?: string;
  onClose: () => void;
  onConfirm: () => void;
  tone?: "ok" | "warn";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button className="absolute inset-0 bg-[#14211c]/40" aria-label="Close" onClick={onClose} />
      <div role="dialog" className="relative w-full max-w-md rounded-3xl bg-card p-6 shadow-[var(--shadow)]">
        <h2 className="display text-2xl">{title}</h2>
        <p className="mt-2 text-sm text-muted">{body}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {cancel ?? "Cancel"}
          </Button>
          <Button variant={tone === "warn" ? "ember" : "primary"} onClick={onConfirm}>
            {confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Avatar({
  initials,
  hue,
  size = "md",
}: {
  initials: string;
  hue: number;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "h-9 w-9 text-xs" : size === "lg" ? "h-16 w-16 text-lg" : "h-11 w-11 text-sm";
  return (
    <div
      className={cn("flex items-center justify-center rounded-full font-semibold text-[#f6f1e7]", dim)}
      style={{ background: `hsl(${hue} 35% 32%)` }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    sell: "bg-[#14211c] text-[#f6f1e7]",
    trade: "bg-[#2f4d6e] text-white",
    giveaway: "bg-forest text-[#f6f1e7]",
    lend: "bg-[#8a5a12] text-white",
    skill: "bg-ember text-white",
  };
  const label: Record<string, string> = {
    sell: "Sell",
    trade: "Trade",
    giveaway: "Give away",
    lend: "Lend",
    skill: "Skill",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide", map[type])}>
      {label[type] ?? type}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-[#dce8e1] text-forest",
    negotiating: "bg-[#f3e4c6] text-[#7a5410]",
    accepted: "bg-[#d9eadf] text-forest",
    completed: "bg-paper-2 text-muted",
    declined: "bg-[#f3d9d4] text-ember",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs capitalize", map[status] ?? "bg-paper-2")}>
      {status}
    </span>
  );
}

export function Toasts() {
  const { toasts, dismissToast } = useStore();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[80] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          className="pointer-events-auto toast-in rounded-2xl border border-line bg-card p-3 text-left shadow-[var(--shadow)]"
        >
          <p className="text-sm font-medium">{t.title}</p>
          {t.body ? <p className="text-xs text-muted">{t.body}</p> : null}
        </button>
      ))}
    </div>
  );
}

export function StarRow({ rating }: { rating: number }) {
  return (
    <span className="text-sm text-muted">
      <span className="text-gold">★</span> {rating.toFixed(1)}
    </span>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-forest underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}
