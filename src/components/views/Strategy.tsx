"use client";

import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
import type { CampaignLine, ScoredCreator } from "@/lib/types";
import { computeTotals } from "@/lib/campaign";
import { fmtInrCompact, fmtSubs, fmtX } from "@/lib/format";
import { Badge, Banner, Card, NotVerified, PageHeader } from "../ui";

const OBJECTIVES = [
  "Build awareness of the sleep and living range among urban and regional-language home-makers.",
  "Drive considered-purchase intent through long-form, demonstration-led integrations.",
  "Generate trackable offer redemptions to measure cost per acquisition.",
  "Learn which categories and languages deserve scale in a second phase.",
];

const AUDIENCE = [
  "Young households furnishing a first or second home and researching bedroom purchases.",
  "Urban professionals with sleep-quality concerns who respond to routine and wellbeing content.",
  "Tier 2 and Tier 3 city shoppers who prefer content in their own language.",
];

const IDEAS = [
  { title: "Bedroom makeover", body: "A home creator rebuilds a bedroom around a new mattress; the product is the hero of the reveal." },
  { title: "Evening routine", body: "A lifestyle creator shows a wind-down routine, with the sleep setup integrated naturally." },
  { title: "Sleep explainer", body: "A wellness creator covers sleep hygiene in an educational segment, with a light, claim-free product mention." },
  { title: "Regional-language test", body: "One Hindi-adjacent and one other regional-language creator run the same brief to compare response." },
];

const DELIVERABLES = [
  "6 long-form integrated videos (one per shortlisted creator), 60 to 90 second dedicated segment each.",
  "2 YouTube Shorts cut-downs per creator for reach.",
  "A pinned comment and description link with a trackable offer code.",
  "Performance report at day 7 and day 30, including views, watch time, retention, clicks and redemptions.",
];

const TIMELINE = [
  ["Weeks 1 to 2", "Verify shortlist data, brief creators, agree contract terms and claims guardrails."],
  ["Weeks 3 to 4", "Concepting, script review and product seeding."],
  ["Weeks 5 to 8", "Production, brand review, staggered publishing."],
  ["Weeks 9 to 10", "Paid amplification of best performers, if rights allow."],
  ["Weeks 11 to 12", "Day-30 reporting, learnings and phase two recommendation."],
];

const RIGHTS = [
  "Organic usage on the brand's own channels for 3 months from publish date.",
  "Paid usage (whitelisting or boosting) for 30 to 60 days, priced as a separate line.",
  "Creator retains ownership of the content; the brand receives a licence only.",
  "Raw footage not included unless negotiated.",
];

const EXCLUSIVITY = [
  "Category exclusivity (mattresses and bedding) for 30 days either side of publishing.",
  "Narrower scope is cheaper; broader or longer exclusivity should be priced up.",
  "No exclusivity on unrelated categories.",
];

const SAFETY = [
  "Review each creator's recent 20 to 30 videos for tone, controversy and past ad disclosures before outreach.",
  "Disclose paid partnerships using YouTube's paid-promotion tools and applicable Indian advertising rules; confirm current requirements with legal counsel.",
  "No medical or therapeutic sleep claims; all product claims pre-approved by the brand.",
  "Extra scrutiny for health-professional creators, where claims rules are stricter.",
];

const NEGOTIATION = [
  "Anchor on outcomes (verified views, retention) rather than subscriber counts, which are unconfirmed here.",
  "Trade usage length against fee; ask for performance access as part of the deal.",
  "Seek a modest performance bonus tied to redemptions instead of a higher fixed fee.",
  "Use a small paid pilot first; offer a multi-video follow-on for creators who deliver.",
  "Clarify revision rounds, approval turnaround and late-delivery remedies in the contract.",
];

const ALLOCATION: [string, number, string][] = [
  ["Creator fees (integrations and Shorts)", 70, "Illustrative split; actual fees depend on verified views and negotiation."],
  ["Usage rights and whitelisting", 12, "Paid usage priced separately from the integration."],
  ["Paid amplification of top performers", 10, "Depends on rights granted."],
  ["Product seeding and contingency", 8, "Includes seeded units and agency or tool costs."],
];

export default function Strategy({
  ranked,
  lines,
  aov,
}: {
  ranked: ScoredCreator[];
  lines: CampaignLine[];
  aov: number;
}) {
  const [includeTech, setIncludeTech] = useState(false);
  const totals = useMemo(() => computeTotals(lines, aov), [lines, aov]);
  const shortlist = useMemo(
    () => ranked.filter((r) => includeTech || r.creator.category !== "Technology").slice(0, 6),
    [ranked, includeTech]
  );

  return (
    <>
      <PageHeader
        title="Brand Deal Strategy"
        subtitle="Hypothetical campaign “Better Sleep, Better Living” using Wakefit as an example brand."
        actions={
          <button className="btn-primary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden /> Print or save as PDF
          </button>
        }
      />

      <Banner>
        <strong>Hypothetical proposal.</strong> This is an exercise prepared for a portfolio. I have no relationship
        with Wakefit or any creator named here, and nothing below implies one. Fees, budgets and outcomes are
        illustrative assumptions. Use your browser&apos;s print dialog (choose &quot;Save as PDF&quot;) to export.
      </Banner>

      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <ListCard title="Campaign objectives" items={OBJECTIVES} />
          <ListCard title="Target audience hypotheses" note="Hypotheses to validate; no audience data is verified." items={AUDIENCE} />
        </div>

        <Card
          title="Creator shortlist"
          note="Top six by current fit score (weights set in Creator Fit Scoring). Verify all data before outreach."
        >
          <label className="no-print mb-3 inline-flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" checked={includeTech} onChange={(e) => setIncludeTech(e.target.checked)} />
            Include technology creators
          </label>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="th">#</th>
                  <th className="th">Creator</th>
                  <th className="th">Category</th>
                  <th className="th text-right">Subscribers</th>
                  <th className="th text-right">Score</th>
                  <th className="th">Proposed role (hypothesis)</th>
                </tr>
              </thead>
              <tbody>
                {shortlist.map((s, i) => (
                  <tr key={s.creator.id}>
                    <td className="td">{i + 1}</td>
                    <td className="td font-medium">{s.creator.name}</td>
                    <td className="td"><Badge tone="blue">{s.creator.category}</Badge></td>
                    <td className="td text-right">{s.creator.subscribers === null ? <NotVerified /> : fmtSubs(s.creator.subscribers)}</td>
                    <td className="td text-right font-semibold">{s.total.toFixed(1)}</td>
                    <td className="td text-xs">{s.creator.partnershipOpportunity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Content integration ideas">
          <div className="grid gap-4 md:grid-cols-2">
            {IDEAS.map((i) => (
              <div key={i.title} className="rounded-md border border-ink-100 p-3">
                <div className="text-sm font-semibold text-ink-900">{i.title}</div>
                <p className="mt-1 text-sm text-ink-700">{i.body}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <ListCard title="Deliverables" items={DELIVERABLES} />
          <Card title="Timeline (12 weeks)">
            <ol className="space-y-3 text-sm">
              {TIMELINE.map(([w, d]) => (
                <li key={w} className="grid grid-cols-[110px_1fr] gap-3">
                  <span className="font-medium text-ink-900">{w}</span>
                  <span className="text-ink-700">{d}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <ListCard title="Usage rights" items={RIGHTS} />
          <ListCard title="Exclusivity" items={EXCLUSIVITY} />
          <ListCard title="Brand safety" items={SAFETY} />
        </div>

        <Card
          title="Illustrative commercial assumptions"
          note={`Total budget is taken from Campaign Analytics (${fmtInrCompact(totals.spendInr)}). Percent splits are illustrative.`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse">
              <thead>
                <tr>
                  <th className="th">Line</th>
                  <th className="th text-right">Share</th>
                  <th className="th text-right">Amount</th>
                  <th className="th">Note</th>
                </tr>
              </thead>
              <tbody>
                {ALLOCATION.map(([label, pct, note]) => (
                  <tr key={label}>
                    <td className="td">{label}</td>
                    <td className="td text-right">{pct}%</td>
                    <td className="td text-right tabular-nums">{fmtInrCompact((totals.spendInr * pct) / 100)}</td>
                    <td className="td text-xs text-ink-600">{note}</td>
                  </tr>
                ))}
                <tr>
                  <td className="td font-semibold">Total</td>
                  <td className="td text-right font-semibold">{ALLOCATION.reduce((s, a) => s + a[1], 0)}%</td>
                  <td className="td text-right font-semibold tabular-nums">{fmtInrCompact(totals.spendInr)}</td>
                  <td className="td" />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-600">
            Simulated outcome at these assumptions: {fmtX(totals.roas)} ROAS. This is a model output, not a forecast.
          </p>
        </Card>

        <ListCard title="Negotiation considerations" items={NEGOTIATION} />
      </div>
    </>
  );
}

function ListCard({ title, note, items }: { title: string; note?: string; items: string[] }) {
  return (
    <Card title={title} note={note}>
      <ul className="list-disc space-y-2 pl-5 text-sm text-ink-700">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </Card>
  );
}
