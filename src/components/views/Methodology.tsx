"use client";

import { useMemo } from "react";
import { ExternalLink } from "lucide-react";
import creatorsData from "@/data/creators.json";
import marketData from "@/data/market.json";
import type { Creator, MarketItem, Weights } from "@/lib/types";
import { DIMENSIONS, SCORE_KEYS, normalizeWeights } from "@/lib/scoring";
import { Badge, Card, PageHeader } from "../ui";

const CREATORS = creatorsData as unknown as Creator[];
const MARKET = marketData as MarketItem[];

export default function Methodology({ weights }: { weights: Weights }) {
  const nw = normalizeWeights(weights);

  const sources = useMemo(() => {
    const map = new Map<string, string>();
    CREATORS.forEach((c) => c.sourceLinks.forEach((s) => map.set(s.url, s.label)));
    MARKET.forEach((m) => m.url && map.set(m.url, m.source));
    return Array.from(map, ([url, label]) => ({ url, label }));
  }, []);

  return (
    <>
      <PageHeader
        title="Methodology & Sources"
        subtitle="How data was gathered, how the scoring and campaign models work, and what is not yet verified."
      />
      <div className="space-y-5">
        <Card title="Data status labels">
          <ul className="space-y-2 text-sm text-ink-700">
            <li><Badge tone="amber">Not verified</Badge> The value could not be confirmed from a source I could read, so it is left blank rather than estimated.</li>
            <li><Badge tone="amber">Hypothesis</Badge> An analyst inference (for example, content format guessed from a channel name). Needs checking.</li>
            <li><Badge tone="amber">Analyst assessment</Badge> A judgement used as a scoring input. Not measured.</li>
            <li><Badge tone="green">Sourced fact</Badge> Taken from a linked page, with the date accessed. Some are headline-only and say so.</li>
          </ul>
        </Card>

        <Card title="Creator data collection">
          <ul className="list-disc space-y-2 pl-5 text-sm text-ink-700">
            <li>Creators were selected from third-party aggregator ranking pages (Modash, Heepsy) read on 2026-11-21. Aggregator pages show &quot;last updated 11/09/2026&quot;, a date format that is ambiguous.</li>
            <li>Subscriber counts are the aggregator&apos;s figures and were not checked on YouTube. Two technology entries come from a page that labels the figure &quot;followers&quot;.</li>
            <li>Channel links use the handle printed on the aggregator page. Two entries had no handle, so they link to a YouTube search instead and are flagged.</li>
            <li>Categories for several creators were assigned by the analyst from the list they appeared in, and the match may be loose. TechCM Shorts appeared under productivity, not technology.</li>
            <li>Recent video views, brand integrations and demographics were not collected. They are shown as Not verified.</li>
            <li>No creator is described as having worked with Wakefit or any brand.</li>
          </ul>
        </Card>

        <Card title="Fit scoring model" note="Current effective weights (rescaled to 100) shown below">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse">
              <thead><tr><th className="th">Dimension</th><th className="th text-right">Default</th><th className="th text-right">Current</th><th className="th">Meaning</th></tr></thead>
              <tbody>
                {SCORE_KEYS.map((k) => (
                  <tr key={k}>
                    <td className="td font-medium">{DIMENSIONS[k].label}</td>
                    <td className="td text-right">{{ audience: 30, content: 25, consistency: 20, suitability: 15, integration: 10 }[k]}</td>
                    <td className="td text-right">{nw[k].toFixed(1)}</td>
                    <td className="td text-xs text-ink-600">{DIMENSIONS[k].explain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink-700">
            Score = Σ over dimensions of (input ÷ 10) × effective weight. Inputs are 0 to 10; weights are rescaled so they always total 100. A creator scoring 10 on everything gets 100.
          </p>
        </Card>

        <Card title="Campaign model">
          <p className="text-sm text-ink-700">
            All campaign numbers are simulated. Formulas are listed in Campaign Analytics and checked by <code>npm test</code>, which compares results to hand-computed values. Revenue assumes every conversion is an order at the average order value, ignoring returns, discounts and margin.
          </p>
        </Card>

        <Card title="Known limitations">
          <ul className="list-disc space-y-2 pl-5 text-sm text-ink-700">
            <li>Audience relevance has no demographic data behind it; it is the weakest input.</li>
            <li>View consistency is a neutral placeholder (5) for all creators until views are verified.</li>
            <li>Market facts marked headline-only were not read in full.</li>
            <li>Scores will change materially once real data replaces estimates.</li>
          </ul>
        </Card>

        <Card title="Sources" note="All pages accessed 2026-11-21">
          <ul className="space-y-1.5 text-sm">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                  {s.label} <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
                <div className="break-all text-xs text-ink-400">{s.url}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
