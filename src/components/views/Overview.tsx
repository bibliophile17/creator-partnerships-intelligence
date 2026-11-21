"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CampaignLine, Creator, ScoredCreator } from "@/lib/types";
import { computeLine, computeTotals } from "@/lib/campaign";
import { fmtInrCompact, fmtNum, fmtX } from "@/lib/format";
import { Banner, Card, CATEGORY_COLORS, PageHeader, Segmented, Stat } from "../ui";
import type { GoFn } from "../App";

type Tab = "portfolio" | "scores" | "campaign";

export default function Overview({
  creators,
  ranked,
  lines,
  aov,
  go,
}: {
  creators: Creator[];
  ranked: ScoredCreator[];
  lines: CampaignLine[];
  aov: number;
  go: GoFn;
}) {
  const [tab, setTab] = useState<Tab>("portfolio");
  const totals = useMemo(() => computeTotals(lines, aov), [lines, aov]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    creators.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1));
    return Array.from(map, ([category, count]) => ({ category, count }));
  }, [creators]);

  const verifiedSubs = creators.filter((c) => c.subscribers !== null).length;
  const viewsVerified = creators.filter((c) => c.recentVideoViews !== null).length;
  const top10 = ranked.slice(0, 10).map((s) => ({ name: s.creator.name, score: +s.total.toFixed(1), category: s.creator.category }));
  const lineData = lines.map((l) => ({
    name: l.label.replace(" (simulated)", ""),
    roas: +(computeLine(l, aov).roas ?? 0).toFixed(2),
  }));

  return (
    <>
      <PageHeader
        title="Executive Overview"
        subtitle="A research workbench for evaluating Indian YouTube creators and structuring brand partnership deals, using a hypothetical sleep and living campaign as the worked example."
        actions={
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { id: "portfolio", label: "Portfolio" },
              { id: "scores", label: "Fit scores" },
              { id: "campaign", label: "Campaign" },
            ]}
          />
        }
      />

      <Banner>
        <strong>Read this first.</strong> Subscriber counts come from third-party aggregator listings and are not
        confirmed on YouTube. Recent video views, brand integrations and demographics are <em>Not verified</em>.
        Fit scores are analyst estimates. Campaign numbers are simulated.
      </Banner>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Creators tracked" value={String(creators.length)} hint="Home, Lifestyle, Wellness, Technology" />
        <Stat
          label="Data verification"
          value={`${verifiedSubs}/${creators.length}`}
          hint={`subscriber counts listed by an aggregator; ${viewsVerified} with verified recent views`}
        />
        <Stat label="Top-ranked creator" value={ranked[0].creator.name} hint={`${ranked[0].total.toFixed(1)} / 100 with current weights`} />
        <Stat label="Simulated ROAS" value={fmtX(totals.roas)} hint="Illustrative campaign, not real results" />
      </div>

      {tab === "portfolio" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="Creators by category" note="Count of creators in the research database">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eceff4" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#5b6a82" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5b6a82" }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {byCategory.map((d) => (
                      <Cell key={d.category} fill={CATEGORY_COLORS[d.category] ?? "#1d4ed8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="What this project covers">
            <ul className="space-y-2.5 text-sm text-ink-700">
              <li><button className="font-medium text-brand-700 hover:underline" onClick={() => go("creators")}>Creator database</button>: search, filter, sort and export 20 creators.</li>
              <li><button className="font-medium text-brand-700 hover:underline" onClick={() => go("scoring")}>Fit scoring</button>: a 100-point model with adjustable weights.</li>
              <li><button className="font-medium text-brand-700 hover:underline" onClick={() => go("strategy")}>Brand deal strategy</button>: a printable proposal for a hypothetical campaign.</li>
              <li><button className="font-medium text-brand-700 hover:underline" onClick={() => go("campaign")}>Campaign analytics</button>: editable assumptions with live metrics.</li>
              <li><button className="font-medium text-brand-700 hover:underline" onClick={() => go("market")}>Market intelligence</button>: facts, hypotheses and recommendations kept separate.</li>
            </ul>
          </Card>
        </div>
      )}

      {tab === "scores" && (
        <Card title="Top 10 creators by fit score" note="Uses the weights set in Creator Fit Scoring. Inputs are analyst estimates.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceff4" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#5b6a82" }} />
                <YAxis type="category" dataKey="name" width={170} tick={{ fontSize: 12, fill: "#26364f" }} />
                <Tooltip />
                <Bar dataKey="score" radius={[0, 3, 3, 0]}>
                  {top10.map((d) => (
                    <Cell key={d.name} fill={CATEGORY_COLORS[d.category] ?? "#1d4ed8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink-600">
            {Object.entries(CATEGORY_COLORS).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: v }} />
                {k}
              </span>
            ))}
          </div>
        </Card>
      )}

      {tab === "campaign" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="Simulated campaign summary" note="SIMULATED DATA. Edit the assumptions in Campaign Analytics.">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ["Spend", fmtInrCompact(totals.spendInr)],
                ["Impressions", fmtNum(totals.impressions)],
                ["Views", fmtNum(totals.views)],
                ["Watch time (hours)", fmtNum(totals.watchHours)],
                ["Conversions", fmtNum(totals.conversions)],
                ["ROAS", fmtX(totals.roas)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label">{k}</dt>
                  <dd className="mt-0.5 font-semibold text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card title="Simulated ROAS by line item">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eceff4" vertical={false} />
                  <XAxis dataKey="name" tick={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#5b6a82" }} />
                  <Tooltip />
                  <Bar dataKey="roas" fill="#1d4ed8" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
