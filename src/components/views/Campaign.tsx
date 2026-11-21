"use client";

import { useMemo } from "react";
import { Download, RotateCcw } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CampaignLine } from "@/lib/types";
import { computeLine, computeTotals } from "@/lib/campaign";
import { downloadCsv, toCsv } from "@/lib/csv";
import { fmtInr, fmtInrCompact, fmtNum, fmtPct, fmtX } from "@/lib/format";
import { Banner, Card, PageHeader, Stat } from "../ui";

type InputKey = Exclude<keyof CampaignLine, "id" | "label" | "category">;

const INPUTS: { key: InputKey; label: string; step: number }[] = [
  { key: "spendInr", label: "Spend (₹)", step: 10000 },
  { key: "impressions", label: "Impressions", step: 100000 },
  { key: "viewRatePct", label: "View rate %", step: 0.1 },
  { key: "avdSec", label: "Avg view (s)", step: 5 },
  { key: "videoLenSec", label: "Video (s)", step: 30 },
  { key: "ctrPct", label: "CTR %", step: 0.1 },
  { key: "cvrPct", label: "Conv. rate %", step: 0.1 },
];

const FORMULAS: [string, string][] = [
  ["Views", "Impressions × view rate"],
  ["Watch time (hours)", "Views × average view duration ÷ 3,600"],
  ["Retention", "Average view duration ÷ video length (capped at 100%). Totals use Σ(views × AVD) ÷ Σ(views × length)."],
  ["Clicks", "Views × CTR"],
  ["Conversions", "Clicks × conversion rate"],
  ["Revenue", "Conversions × average order value"],
  ["CPV", "Spend ÷ views"],
  ["CPM", "Spend ÷ impressions × 1,000"],
  ["CPC", "Spend ÷ clicks"],
  ["CPA", "Spend ÷ conversions"],
  ["ROAS", "Revenue ÷ spend"],
];

export default function Campaign({
  lines,
  setLines,
  aov,
  setAov,
  reset,
}: {
  lines: CampaignLine[];
  setLines: (l: CampaignLine[]) => void;
  aov: number;
  setAov: (n: number) => void;
  reset: () => void;
}) {
  const results = useMemo(() => lines.map((l) => computeLine(l, aov)), [lines, aov]);
  const totals = useMemo(() => computeTotals(lines, aov), [lines, aov]);

  const update = (id: string, key: InputKey, raw: string) => {
    const v = raw === "" ? 0 : Number(raw);
    if (!Number.isFinite(v)) return;
    setLines(lines.map((l) => (l.id === id ? { ...l, [key]: Math.max(0, v) } : l)));
  };

  const chartData = lines.map((l, i) => ({
    name: `L${i + 1}`,
    Spend: Math.round(l.spendInr),
    Revenue: Math.round(results[i].revenueInr),
  }));

  const exportCsv = () => {
    const headers = ["Line", "Category", "Spend INR", "Impressions", "View rate %", "Avg view s", "Video length s", "CTR %", "Conversion rate %", "Views", "Watch hours", "Retention %", "Clicks", "Conversions", "Revenue INR", "CPV", "CPM", "CPC", "CPA", "ROAS"];
    const r2 = (n: number | null) => (n === null ? "" : n.toFixed(2));
    const data = lines.map((l, i) => {
      const r = results[i];
      return [l.label, l.category, l.spendInr, l.impressions, l.viewRatePct, l.avdSec, l.videoLenSec, l.ctrPct, l.cvrPct, r.views.toFixed(0), r.watchHours.toFixed(1), r.retentionPct.toFixed(1), r.clicks.toFixed(0), r.conversions.toFixed(1), r.revenueInr.toFixed(0), r2(r.cpv), r2(r.cpm), r2(r.cpc), r2(r.cpa), r2(r.roas)];
    });
    data.push(["TOTAL", "", totals.spendInr, totals.impressions, totals.viewRatePct.toFixed(2), "", "", totals.ctrPct.toFixed(2), "", totals.views.toFixed(0), totals.watchHours.toFixed(1), totals.retentionPct.toFixed(1), totals.clicks.toFixed(0), totals.conversions.toFixed(1), totals.revenueInr.toFixed(0), r2(totals.cpv), r2(totals.cpm), r2(totals.cpc), r2(totals.cpa), r2(totals.roas)]);
    headers[0] = "Line (SIMULATED DATA)";
    downloadCsv("campaign-analytics-simulated.csv", toCsv(headers, data));
  };

  return (
    <>
      <PageHeader
        title="Campaign Performance Analytics"
        subtitle="Edit any assumption and every metric recalculates. All figures are simulated for a hypothetical campaign."
        actions={
          <>
            <button className="btn" onClick={reset}><RotateCcw className="h-4 w-4" aria-hidden /> Reset to sample</button>
            <button className="btn" onClick={exportCsv}><Download className="h-4 w-4" aria-hidden /> Export CSV</button>
          </>
        }
      />
      <Banner>
        <strong>SIMULATED DATA.</strong> These numbers are illustrative inputs, not results from any real campaign,
        brand or creator. Line items are generic archetypes.
      </Banner>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Spend" value={fmtInrCompact(totals.spendInr)} />
        <Stat label="Impressions" value={fmtNum(totals.impressions)} />
        <Stat label="Views" value={fmtNum(totals.views)} hint={`${fmtPct(totals.viewRatePct, 2)} of impressions`} />
        <Stat label="Watch time" value={`${fmtNum(totals.watchHours)} h`} hint={`Retention ${fmtPct(totals.retentionPct)}`} />
        <Stat label="Clicks" value={fmtNum(totals.clicks)} hint={`CTR ${fmtPct(totals.ctrPct, 2)}`} />
        <Stat label="Conversions" value={fmtNum(totals.conversions, 0)} hint={`CPA ${fmtInr(totals.cpa)}`} />
        <Stat label="CPV" value={fmtInr(totals.cpv, 2)} hint={`CPM ${fmtInr(totals.cpm, 0)}`} />
        <Stat label="ROAS" value={fmtX(totals.roas)} hint={`Revenue ${fmtInrCompact(totals.revenueInr)}`} />
      </div>

      <Card title="Assumptions" note="Click any cell to edit. Average order value applies to all line items." className="mb-5">
        <div className="mb-4 max-w-xs">
          <label htmlFor="aov" className="label">Average order value (₹)</label>
          <input id="aov" type="number" min={0} step={500} className="input mt-1" value={aov} onChange={(e) => setAov(Math.max(0, Number(e.target.value) || 0))} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr>
                <th className="th">Line item (simulated)</th>
                {INPUTS.map((i) => <th key={i.key} className="th">{i.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.id}>
                  <td className="td text-xs font-medium">{l.label}</td>
                  {INPUTS.map((i) => (
                    <td key={i.key} className="td">
                      <input
                        type="number"
                        min={0}
                        step={i.step}
                        className="input w-28 px-2 py-1"
                        value={l[i.key]}
                        onChange={(e) => update(l.id, i.key, e.target.value)}
                        aria-label={`${l.label} ${i.label}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Calculated results" className="mb-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr>
                <th className="th">Line item</th>
                <th className="th text-right">Views</th>
                <th className="th text-right">Watch h</th>
                <th className="th text-right">Retention</th>
                <th className="th text-right">Clicks</th>
                <th className="th text-right">Conversions</th>
                <th className="th text-right">CPV</th>
                <th className="th text-right">CPA</th>
                <th className="th text-right">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => {
                const r = results[i];
                return (
                  <tr key={l.id}>
                    <td className="td text-xs">{l.label}</td>
                    <td className="td text-right tabular-nums">{fmtNum(r.views)}</td>
                    <td className="td text-right tabular-nums">{fmtNum(r.watchHours)}</td>
                    <td className="td text-right tabular-nums">{fmtPct(r.retentionPct)}</td>
                    <td className="td text-right tabular-nums">{fmtNum(r.clicks)}</td>
                    <td className="td text-right tabular-nums">{fmtNum(r.conversions, 1)}</td>
                    <td className="td text-right tabular-nums">{fmtInr(r.cpv, 2)}</td>
                    <td className="td text-right tabular-nums">{fmtInr(r.cpa)}</td>
                    <td className="td text-right font-semibold tabular-nums">{fmtX(r.roas)}</td>
                  </tr>
                );
              })}
              <tr className="bg-ink-50/60">
                <td className="td font-semibold">Total</td>
                <td className="td text-right font-semibold tabular-nums">{fmtNum(totals.views)}</td>
                <td className="td text-right font-semibold tabular-nums">{fmtNum(totals.watchHours)}</td>
                <td className="td text-right font-semibold tabular-nums">{fmtPct(totals.retentionPct)}</td>
                <td className="td text-right font-semibold tabular-nums">{fmtNum(totals.clicks)}</td>
                <td className="td text-right font-semibold tabular-nums">{fmtNum(totals.conversions, 1)}</td>
                <td className="td text-right font-semibold tabular-nums">{fmtInr(totals.cpv, 2)}</td>
                <td className="td text-right font-semibold tabular-nums">{fmtInr(totals.cpa)}</td>
                <td className="td text-right font-semibold tabular-nums">{fmtX(totals.roas)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-500">A dash means the metric cannot be computed (for example, CPA with zero conversions).</p>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Spend vs revenue by line item (simulated)" note="L1 to L6 follow the table order">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceff4" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#5b6a82" }} />
                <YAxis tickFormatter={(v: number) => fmtInrCompact(v)} tick={{ fontSize: 11, fill: "#5b6a82" }} width={70} />
                <Tooltip formatter={(v) => fmtInr(Number(v))} />
                <Legend />
                <Bar dataKey="Spend" fill="#93b4f5" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Revenue" fill="#1d4ed8" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Formulas and assumptions">
          <dl className="space-y-2 text-sm">
            {FORMULAS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[130px_1fr] gap-3">
                <dt className="font-medium text-ink-900">{k}</dt>
                <dd className="text-ink-700">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-ink-500">
            Ratios in the total row are recomputed from summed totals rather than averaged. Revenue assumes every
            conversion is an order at the average order value; it ignores returns, discounts and margin.
          </p>
        </Card>
      </div>
    </>
  );
}
