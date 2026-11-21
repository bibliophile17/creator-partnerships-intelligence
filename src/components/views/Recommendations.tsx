"use client";

import { useMemo } from "react";
import type { CampaignLine, ScoredCreator } from "@/lib/types";
import { computeTotals } from "@/lib/campaign";
import { fmtX } from "@/lib/format";
import { Badge, Banner, Card, PageHeader } from "../ui";
import type { GoFn } from "../App";

export default function Recommendations({
  ranked,
  lines,
  aov,
  go,
}: {
  ranked: ScoredCreator[];
  lines: CampaignLine[];
  aov: number;
  go: GoFn;
}) {
  const totals = useMemo(() => computeTotals(lines, aov), [lines, aov]);
  const top = ranked.filter((r) => r.creator.category !== "Technology").slice(0, 3);
  const unverified = ranked.length;

  const recs = [
    {
      n: 1,
      title: "Verify before you pitch",
      body: `Recent video views, languages and brand integrations are unverified for all ${unverified} creators. Spend the first two weeks confirming channel handles, the last 10 long-form video views, and recent sponsored content from YouTube itself.`,
      basis: "Data gap documented in Creator Intelligence",
    },
    {
      n: 2,
      title: "Start with a Home and Lifestyle core",
      body: `With current weights, the top non-technology creators are ${top.map((t) => t.creator.name).join(", ")}. Home and lifestyle content connect most naturally to a sleep and living brief. Treat the ranking as a hypothesis, since inputs are analyst estimates.`,
      basis: "Creator Fit Scoring (live, follows your weights)",
    },
    {
      n: 3,
      title: "Add one regional-language test cell",
      body: "Include one or two creators in a language beyond Hindi and English, with an identical brief, so language effects can be measured rather than assumed.",
      basis: "Hypothesis h1; supporting context in facts m7 to m9 (dated, partly headline-only)",
    },
    {
      n: 4,
      title: "Handle wellness creators with claims guardrails",
      body: "Expert-led wellness channels can add credibility but carry claims risk. Keep integrations educational, pre-approve all claims and involve legal review.",
      basis: "Hypothesis h3",
    },
    {
      n: 5,
      title: "Negotiate for performance access and paid usage",
      body: "YouTube describes tools that let brands see a video's performance and put paid media behind creator content. Ask for performance access and price paid usage separately.",
      basis: "Facts m4, m5; recommendation r2",
    },
    {
      n: 6,
      title: "Judge success on cost per acquisition, not views alone",
      body: `The simulated model returns ${fmtX(totals.roas)} ROAS at the current assumptions. Treat this as a template for tracking, then replace every input with measured pilot data.`,
      basis: "Campaign Analytics (simulated)",
    },
  ];

  return (
    <>
      <PageHeader
        title="Strategic Recommendations"
        subtitle="Recommendations are judgements built on the evidence and gaps documented elsewhere in this project. Each one states its basis."
      />
      <Banner>
        These are analyst recommendations, not findings. They depend on unverified creator data and simulated campaign
        assumptions.
      </Banner>

      <div className="space-y-4">
        {recs.map((r) => (
          <Card key={r.n}>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                {r.n}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-ink-900">{r.title}</h2>
                  <Badge tone="blue">Recommendation</Badge>
                </div>
                <p className="mt-1.5 text-sm text-ink-700">{r.body}</p>
                <p className="mt-2 text-xs text-ink-500">Basis: {r.basis}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Suggested next steps" className="mt-5">
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-ink-700">
          <li>Fill the Recent video views and Brand integrations fields in <code>src/data/creators.json</code> from YouTube.</li>
          <li>Re-score the creators and review the shortlist in <button className="text-brand-700 hover:underline" onClick={() => go("strategy")}>Brand Deal Strategy</button>.</li>
          <li>Replace the simulated assumptions in <button className="text-brand-700 hover:underline" onClick={() => go("campaign")}>Campaign Analytics</button> with pilot measurements.</li>
        </ol>
      </Card>
    </>
  );
}
