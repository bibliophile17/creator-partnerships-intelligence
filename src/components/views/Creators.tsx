"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, Download, ExternalLink, Search } from "lucide-react";
import type { Creator, ScoredCreator } from "@/lib/types";
import { downloadCsv, toCsv } from "@/lib/csv";
import { fmtSubs, NV } from "@/lib/format";
import { Badge, Banner, NotVerified, PageHeader } from "../ui";
import type { GoFn } from "../App";

type SortKey = "name" | "subscribers" | "score" | "category";

export default function Creators({
  creators,
  ranked,
  selected,
  toggleSelected,
  go,
}: {
  creators: Creator[];
  ranked: ScoredCreator[];
  selected: string[];
  toggleSelected: (id: string) => void;
  go: GoFn;
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [language, setLanguage] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [asc, setAsc] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const scoreById = useMemo(() => new Map(ranked.map((r) => [r.creator.id, r])), [ranked]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(creators.map((c) => c.category)))], [creators]);
  // Short language label: first word of the language text, so "Hindi (inferred ...)" groups as "Hindi".
  const langKey = (c: Creator) => (c.language.startsWith("Not verified") ? "Not verified" : c.language.split(" ")[0]);
  const languages = useMemo(() => ["All", ...Array.from(new Set(creators.map(langKey))).sort()], [creators]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = creators.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (language !== "All" && langKey(c) !== language) return false;
      if (!needle) return true;
      return [c.name, c.handle, c.category, c.language, c.contentFormat, c.partnershipOpportunity]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
    const dir = asc ? 1 : -1;
    return filtered.sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "category":
          return a.category.localeCompare(b.category) * dir || a.name.localeCompare(b.name);
        case "subscribers":
          // Unverified values always sort last, in either direction.
          if (a.subscribers === null) return 1;
          if (b.subscribers === null) return -1;
          return (a.subscribers - b.subscribers) * dir;
        default:
          return ((scoreById.get(a.id)?.total ?? 0) - (scoreById.get(b.id)?.total ?? 0)) * dir;
      }
    });
  }, [creators, q, category, language, sortKey, asc, scoreById]);

  const exportCsv = () => {
    const headers = [
      "Name", "Handle", "Channel link", "Category", "Language", "Subscribers", "Subscribers as of",
      "Recent video views", "Content format", "Brand integrations", "Brand suitability",
      "Partnership opportunity", "Fit score", "Source links", "Research date",
    ];
    const data = rows.map((c) => [
      c.name, c.handle, c.channelUrl, c.category, c.language, c.subscribers ?? NV, c.subscribersAsOf,
      c.recentVideoViews ?? NV, c.contentFormat, c.brandIntegrations, c.brandSuitability,
      c.partnershipOpportunity, (scoreById.get(c.id)?.total ?? 0).toFixed(1),
      c.sourceLinks.map((s) => s.url).join(" | "), c.researchDate,
    ]);
    downloadCsv("creator-intelligence.csv", toCsv(headers, data));
  };

  return (
    <>
      <PageHeader
        title="India Creator Intelligence"
        subtitle="Research database of 20 Indian YouTube creators. Fields that could not be verified are labelled; edit src/data/creators.json to update records."
        actions={
          <button className="btn" onClick={exportCsv}>
            <Download className="h-4 w-4" aria-hidden /> Export CSV ({rows.length})
          </button>
        }
      />
      <Banner>
        Subscriber counts are taken from third-party aggregator pages (Modash, Heepsy) and are{" "}
        <strong>not confirmed on YouTube</strong>. Languages marked &quot;inferred&quot; were inferred by the
        aggregator from video titles. Recent views and brand integrations are not verified for any creator.
      </Banner>

      <div className="no-print mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-ink-400" aria-hidden />
          <input
            className="input pl-9"
            placeholder="Search name, handle, format, opportunity"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search creators"
          />
        </div>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Filter by language">
          {languages.map((c) => <option key={c}>{c}</option>)}
        </select>
        <div className="flex gap-2">
          <select className="input" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} aria-label="Sort by">
            <option value="score">Sort: fit score</option>
            <option value="subscribers">Sort: subscribers</option>
            <option value="name">Sort: name</option>
            <option value="category">Sort: category</option>
          </select>
          <button className="btn" onClick={() => setAsc((a) => !a)} aria-label="Toggle sort direction">
            {asc ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse">
          <thead>
            <tr>
              <th className="th w-10">Cmp</th>
              <th className="th">Creator</th>
              <th className="th">Category</th>
              <th className="th">Language</th>
              <th className="th text-right">Subscribers</th>
              <th className="th text-right">Recent views</th>
              <th className="th text-right">Fit score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const isOpen = open === c.id;
              const s = scoreById.get(c.id);
              const checked = selected.includes(c.id);
              return (
                <Fragment key={c.id}>
                  <tr className={isOpen ? "bg-brand-50/40" : "hover:bg-ink-50/60"}>
                    <td className="td">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!checked && selected.length >= 4}
                        onChange={() => toggleSelected(c.id)}
                        aria-label={`Select ${c.name} for comparison`}
                        title={!checked && selected.length >= 4 ? "Up to 4 creators can be compared" : "Add to comparison"}
                      />
                    </td>
                    <td className="td">
                      <button className="flex items-center gap-1.5 text-left font-medium text-ink-900 hover:text-brand-700" onClick={() => setOpen(isOpen ? null : c.id)} aria-expanded={isOpen}>
                        {isOpen ? <ChevronDown className="h-4 w-4" aria-hidden /> : <ChevronRight className="h-4 w-4" aria-hidden />}
                        {c.name}
                      </button>
                      <div className="ml-5 text-xs text-ink-500">{c.handle}</div>
                    </td>
                    <td className="td"><Badge tone="blue">{c.category}</Badge></td>
                    <td className="td text-xs">
                      {c.language.startsWith("Not verified") ? <NotVerified /> : c.language}
                    </td>
                    <td className="td text-right">
                      {c.subscribers === null ? <NotVerified /> : fmtSubs(c.subscribers)}
                      {c.subscribers !== null && <div className="text-[10px] text-ink-400">aggregator</div>}
                    </td>
                    <td className="td text-right"><NotVerified /></td>
                    <td className="td text-right font-semibold">{s ? s.total.toFixed(1) : "—"}</td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-brand-50/40">
                      <td className="td" />
                      <td className="td" colSpan={6}>
                        <div className="grid gap-4 text-sm md:grid-cols-2">
                          <Detail label="Channel link">
                            <a href={c.channelUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                              {c.channelUrl} <ExternalLink className="h-3 w-3" aria-hidden />
                            </a>
                            {c.channelLinkType === "search-link-only" && (
                              <div className="mt-1 text-xs text-amber-800">Search link only. Locate and confirm the official channel.</div>
                            )}
                          </Detail>
                          <Detail label="Subscribers">
                            {c.subscribers === null ? <NotVerified /> : <>{c.subscribers.toLocaleString("en-IN")} <span className="text-xs text-ink-500">as of {c.subscribersAsOf}</span></>}
                            {c.subscribersNote && <div className="mt-1 text-xs text-ink-600">{c.subscribersNote}</div>}
                          </Detail>
                          <Detail label="Recent video views"><NotVerified /><div className="mt-1 text-xs text-ink-600">{c.recentVideoViewsNote}</div></Detail>
                          <Detail label="Content format"><Badge tone="amber">Hypothesis</Badge> <span className="ml-1">{c.contentFormat}</span></Detail>
                          <Detail label="Brand integrations"><NotVerified /></Detail>
                          <Detail label="Brand suitability"><Badge tone="amber">Analyst assessment</Badge> <span className="ml-1">{c.brandSuitability}</span></Detail>
                          <Detail label="Partnership opportunity"><Badge tone="amber">Hypothesis</Badge> <span className="ml-1">{c.partnershipOpportunity}</span></Detail>
                          <Detail label="Sources and research date">
                            <ul className="space-y-0.5">
                              {c.sourceLinks.map((l) => (
                                <li key={l.url}><a href={l.url} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">{l.label}</a></li>
                              ))}
                            </ul>
                            <div className="mt-1 text-xs text-ink-500">Researched {c.researchDate}</div>
                          </Detail>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {rows.length === 0 && (
              <tr><td className="td py-10 text-center text-ink-500" colSpan={7}>No creators match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="no-print mt-4 flex items-center justify-between text-sm text-ink-600">
        <span>{selected.length} selected for comparison (max 4)</span>
        <button className="btn-primary" disabled={selected.length < 2} onClick={() => go("compare")} style={selected.length < 2 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>
          Compare selected
        </button>
      </div>
    </>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="label mb-1">{label}</div>
      <div className="text-ink-800">{children}</div>
    </div>
  );
}
