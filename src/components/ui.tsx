import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-sm text-ink-600">{subtitle}</p>}
      </div>
      {actions && <div className="no-print flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  note,
  children,
  className = "",
}: {
  title?: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`}>
      {title && (
        <header className="border-b border-ink-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
          {note && <p className="mt-0.5 text-xs text-ink-500">{note}</p>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card p-4">
      <div className="label">{label}</div>
      <div className="mt-1.5 text-2xl font-semibold tracking-tight text-ink-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-500">{hint}</div>}
    </div>
  );
}

const TONES = {
  neutral: "bg-ink-100 text-ink-700",
  blue: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
  green: "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200",
  red: "bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-200",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function NotVerified({ children = "Not verified" }: { children?: ReactNode }) {
  return <Badge tone="amber">{children}</Badge>;
}

export function Banner({
  tone = "amber",
  children,
}: {
  tone?: "amber" | "blue";
  children: ReactNode;
}) {
  const cls =
    tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-brand-100 bg-brand-50 text-ink-800";
  return <div className={`mb-5 rounded-md border px-4 py-3 text-sm ${cls}`}>{children}</div>;
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div
      role="tablist"
      className="no-print inline-flex rounded-md border border-ink-200 bg-white p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id ? "bg-ink-900 text-white" : "text-ink-600 hover:text-ink-900"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const CHART_COLORS = ["#1d4ed8", "#3b82f6", "#0b1b33", "#5b6a82", "#93b4f5"];
export const CATEGORY_COLORS: Record<string, string> = {
  Home: "#1d4ed8",
  Lifestyle: "#3b82f6",
  Wellness: "#0b1b33",
  Technology: "#8591a5",
};
