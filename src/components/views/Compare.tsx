"use client";

import { useMemo, type ReactNode } from "react";
import { Download, X } from "lucide-react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ScoredCreator, Weights } from "@/lib/types";
import { DIMENSIONS, SCORE_KEYS, normalizeWeights } from "@/lib/scoring";
import { downloadCsv, toCsv } from "@/lib/csv";
import { fmtSubs, NV } from "@/lib/format";
import { Badge, Card, CHART_COLORS, NotVerified, PageHeader } from "../ui";

export default function Compare({
  ranked,
  weights,
  selected,
  toggleSelected,
  clear,
}: {
  ranked: ScoredCreator[];
  weights: Weights;
  selected: string[];
  toggleSelected: (id: string) => void;
  clear: () => void;
}) {
  const nw = normalizeWeights(weights);
  const chosen = useMemo(
    () => selected.map((id) => ranked.find((r) => r.creator.id === id)).filter((r): r is ScoredCreator => !!r),
    [selected, ranked]
  );

  const radarData = SCORE_KEYS.map((k) => {
    const row: Record<string, string | number> = { dimension: DIMENSIONS[k].short };
    chosen.forEach((s) => (row[s.creator.name] = s.creator.scores[k]));
    return row;
  });

  const exportCsv = () => {
    const headers = ["Metric", ...chosen.map((s) => s.creator.name)];
    const rows: unknown[][] = [
      ["Category", ...chosen.map((s) => s.creator.category)],
      ["Language", ...chosen.map((s) => s.creator.language)],
      ["Subscribers (aggregator, unconfirmed)", ...chosen.map((s) => s.creator.subscribers ?? NV)],
      ["Recent video views", ...chosen.map(() => NV)],
      ["Rank", ...chosen.map((s) => s.rank)],
      ["Total score /100", ...chosen.map((s) => s.total.toFixed(1))],
      ...SCORE_KEYS.map((k) => [`${DIMENSIONS[k].label} (input /10)`, ...chosen.map((s) => s.creator.scores[k])]),
      ...SCORE_KEYS.map((k) => [`${DIMENSIONS[k].label} (points)`, ...chosen.map((s) => s.parts[k].toFixed(1))]),
      ["Brand suitability note", ...chosen.map((s) => s.creator.brandSuitability)],
      ["Partnership opportunity (hypothesis)", ...chosen.map((s) => s.creator.partnershipOpportunity)],
    ];
    downloadCsv("creator-comparison.csv", toCsv(headers, rows));
  };

  return (
    <>
      <PageHeader
        title="Creator Comparison"
        subtitle="Compare two to four creators side by side. Scores use the weights currently set in Creator Fit Scoring."
        actions={
          chosen.length > 0 && (
            <>
              <button className="btn" onClick={exportCsv} disabled={chosen.length < 2}>
                <Download className="h-4 w-4" aria-hidden /> Export CSV
              </button>
              <button className="btn" onClick={clear}>
                <X className="h-4 w-4" aria-hidden /> Clear
              </button>
            </>
          )
        }
      />

      <Card title="Choose creators" note={`${chosen.length} of 4 selected. Click a name to add or remove.`} className="mb-5">
        <div className="flex flex-wrap gap-2">
          {ranked.map((s) => {
            const on = selected.includes(s.creator.id);
            const disabled = !on && selected.length >= 4;
            return (
              <button
                key={s.creator.id}
                onClick={() => toggleSelected(s.creator.id)}
                disabled={disabled}
                aria-pressed={on}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  on
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-ink-200 bg-white text-ink-700 hover:bg-ink-50"
                } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {s.creator.name}
              </button>
            );
          })}
        </div>
      </Card>

      {chosen.length < 2 ? (
        <Card>
          <p className="py-8 text-center text-sm text-ink-500">Select at least two creators to see the comparison.</p>
        </Card>
      ) : (
        <div className="space-y-5">
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="th">Metric</th>
                  {chosen.map((s) => (
                    <th key={s.creator.id} className="th">{s.creator.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Row label="Category">{chosen.map((s) => <td key={s.creator.id} className="td"><Badge tone="blue">{s.creator.category}</Badge></td>)}</Row>
                <Row label="Language">{chosen.map((s) => <td key={s.creator.id} className="td text-xs">{s.creator.language.startsWith("Not verified") ? <NotVerified /> : s.creator.language}</td>)}</Row>
                <Row label="Subscribers (aggregator)">{chosen.map((s) => <td key={s.creator.id} className="td">{s.creator.subscribers === null ? <NotVerified /> : fmtSubs(s.creator.subscribers)}</td>)}</Row>
                <Row label="Recent video views">{chosen.map((s) => <td key={s.creator.id} className="td"><NotVerified /></td>)}</Row>
                <Row label="Rank (of 20)">{chosen.map((s) => <td key={s.creator.id} className="td font-medium">#{s.rank}</td>)}</Row>
                <Row label="Total score / 100">
                  {chosen.map((s) => {
                    const best = Math.max(...chosen.map((x) => x.total));
                    return <td key={s.creator.id} className={`td font-semibold ${s.total === best ? "text-brand-700" : ""}`}>{s.total.toFixed(1)}</td>;
                  })}
                </Row>
                {SCORE_KEYS.map((k) => (
                  <Row key={k} label={`${DIMENSIONS[k].label} (weight ${nw[k].toFixed(0)})`}>
                    {chosen.map((s) => (
                      <td key={s.creator.id} className="td">
                        {s.parts[k].toFixed(1)} <span className="text-xs text-ink-400">({s.creator.scores[k]}/10)</span>
                      </td>
                    ))}
                  </Row>
                ))}
                <Row label="Brand suitability note">{chosen.map((s) => <td key={s.creator.id} className="td text-xs">{s.creator.brandSuitability}</td>)}</Row>
                <Row label="Partnership opportunity (hypothesis)">{chosen.map((s) => <td key={s.creator.id} className="td text-xs">{s.creator.partnershipOpportunity}</td>)}</Row>
              </tbody>
            </table>
          </div>

          <Card title="Score inputs by dimension (0 to 10)" note="Analyst estimates, not measured data.">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#d9dee7" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: "#26364f" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10, fill: "#8591a5" }} />
                  {chosen.map((s, i) => (
                    <Radar key={s.creator.id} name={s.creator.name} dataKey={s.creator.name} stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.12} />
                  ))}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <tr>
      <td className="td whitespace-nowrap bg-ink-50/50 text-xs font-semibold text-ink-600">{label}</td>
      {children}
    </tr>
  );
}
