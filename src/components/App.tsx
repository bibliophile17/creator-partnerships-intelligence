"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpenCheck,
  FileText,
  Gauge,
  GitCompare,
  Globe2,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Target,
  Users,
  X,
} from "lucide-react";
import creatorsData from "@/data/creators.json";
import campaignData from "@/data/campaign.json";
import type { CampaignLine, Creator, Weights } from "@/lib/types";
import { DEFAULT_WEIGHTS, rankCreators } from "@/lib/scoring";
import Overview from "./views/Overview";
import Creators from "./views/Creators";
import Compare from "./views/Compare";
import Scoring from "./views/Scoring";
import Strategy from "./views/Strategy";
import Campaign from "./views/Campaign";
import Market from "./views/Market";
import Recommendations from "./views/Recommendations";
import Methodology from "./views/Methodology";

const NAV = [
  { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
  { id: "creators", label: "India Creator Intelligence", icon: Users },
  { id: "compare", label: "Creator Comparison", icon: GitCompare },
  { id: "scoring", label: "Creator Fit Scoring", icon: Gauge },
  { id: "strategy", label: "Brand Deal Strategy", icon: Target },
  { id: "campaign", label: "Campaign Analytics", icon: BarChart3 },
  { id: "market", label: "Market Intelligence", icon: Globe2 },
  { id: "recommendations", label: "Strategic Recommendations", icon: Lightbulb },
  { id: "methodology", label: "Methodology & Sources", icon: BookOpenCheck },
] as const;

export type ViewId = (typeof NAV)[number]["id"];

const CREATORS = creatorsData as unknown as Creator[];
const DEFAULT_LINES = campaignData.lines as CampaignLine[];

export default function App() {
  const [view, setViewState] = useState<ViewId>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [weights, setWeights] = useState<Weights>({ ...DEFAULT_WEIGHTS });
  const [selected, setSelected] = useState<string[]>([]);
  const [lines, setLines] = useState<CampaignLine[]>(DEFAULT_LINES);
  const [aov, setAov] = useState<number>(campaignData.aovInr);

  const ranked = useMemo(() => rankCreators(CREATORS, weights), [weights]);

  // Keep the URL hash in sync so a view can be bookmarked or shared.
  useEffect(() => {
    const fromHash = window.location.hash.replace("#", "") as ViewId;
    if (NAV.some((n) => n.id === fromHash)) setViewState(fromHash);
    const onHash = () => {
      const h = window.location.hash.replace("#", "") as ViewId;
      if (NAV.some((n) => n.id === h)) setViewState(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const setView = useCallback((v: ViewId) => {
    setViewState(v);
    setMenuOpen(false);
    window.location.hash = v;
    window.scrollTo({ top: 0 });
  }, []);

  const toggleSelected = useCallback((id: string) => {
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 4 ? cur : [...cur, id]
    );
  }, []);

  const resetCampaign = useCallback(() => {
    setLines(DEFAULT_LINES);
    setAov(campaignData.aovInr);
  }, []);

  const current = NAV.find((n) => n.id === view)!;

  const nav = (
    <nav className="flex flex-col gap-0.5 px-3 pb-4" aria-label="Main">
      {NAV.map((n) => {
        const Icon = n.icon;
        const active = n.id === view;
        return (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
              active
                ? "bg-brand-50 text-brand-700"
                : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {n.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="no-print fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-ink-200 bg-white lg:flex">
        <div className="px-6 py-5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-600" aria-hidden />
            <span className="text-sm font-semibold tracking-tight text-ink-900">
              Creator Partnerships
              <br />
              Intelligence
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-500">India market and YouTube brand deal strategy</p>
        </div>
        {nav}
        <div className="mt-auto border-t border-ink-100 px-6 py-4 text-[11px] leading-relaxed text-ink-500">
          Portfolio project. Creator data is research-stage; campaign data is simulated. Not affiliated with
          Google, YouTube or Wakefit.
        </div>
      </aside>

      {/* Mobile header */}
      <header className="no-print sticky top-0 z-30 flex items-center justify-between border-b border-ink-200 bg-white px-4 py-3 lg:hidden">
        <div className="text-sm font-semibold text-ink-900">{current.label}</div>
        <button
          className="btn px-2 py-1.5"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>
      {menuOpen && (
        <div className="no-print fixed inset-x-0 top-[53px] z-20 max-h-[80vh] overflow-y-auto border-b border-ink-200 bg-white pt-2 shadow-lg lg:hidden">
          {nav}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-9">
        {view === "overview" && <Overview creators={CREATORS} ranked={ranked} lines={lines} aov={aov} go={setView} />}
        {view === "creators" && (
          <Creators creators={CREATORS} ranked={ranked} selected={selected} toggleSelected={toggleSelected} go={setView} />
        )}
        {view === "compare" && (
          <Compare ranked={ranked} weights={weights} selected={selected} toggleSelected={toggleSelected} clear={() => setSelected([])} />
        )}
        {view === "scoring" && <Scoring ranked={ranked} weights={weights} setWeights={setWeights} />}
        {view === "strategy" && <Strategy ranked={ranked} lines={lines} aov={aov} />}
        {view === "campaign" && (
          <Campaign lines={lines} setLines={setLines} aov={aov} setAov={setAov} reset={resetCampaign} />
        )}
        {view === "market" && <Market />}
        {view === "recommendations" && <Recommendations ranked={ranked} lines={lines} aov={aov} go={setView} />}
        {view === "methodology" && <Methodology weights={weights} />}
      </main>
    </div>
  );
}

// Re-exported for views that need to navigate.
export type GoFn = (v: ViewId) => void;
