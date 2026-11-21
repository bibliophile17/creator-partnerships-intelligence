"use client";

import { Fragment, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Download, RotateCcw } from "lucide-react";
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
import type { ScoredCreator, Weights } from "@/lib/types";
import {
  DEFAULT_WEIGHTS,
  DIMENSIONS,
  SCORE_KEYS,
  explainScore,
  normalizeWeights,
  sumWeights,
} from "@/lib/scoring";
import { downloadCsv, toCsv } from "@/lib/csv";
import { Badge, Banner, Card, CHART_COLORS, PageHeader } from "../ui";

export default function Scoring({
  ranked,
  weights,
  setWeights,
}: {
  ranked: ScoredCreator[];
  weights: Weights;
  setWeights: (w: Weights) => void;
}) {
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const nw = normalizeWeights(weights);
  const total = sumWeights(weights);

  const categories = useMemo(() => ["All", ...Array.from(new Set(ranked.map((r) => r.creator.category)))], [ranked]);
  const rows = ranked.filter((r) => category === "All" || r.creator.category === category);
  const chartData = rows.slice(0, 10).map((r) => ({
    name: r.creator.name,
    ...Object.fromEntries(SCORE_KEYS.map((k) => [DIMENSIONS[k].short, +r.parts[k].toFixed(2)])),
  }));

  const exportCsv = () => {
    const headers = ["Rank", "Creator", "Category", "Total /100", ...SCORE_KEYS.map((k) => `${DIMENSIONS[k].label} (points)`), ...SCORE_KEYS.map((k) => `${DIMENSIONS[k].label} (input /10)`)];
    const data = rows.map((r) => [
      r.rank, r.creator.name, r.creator.category, r.total.toFixed(2),
      ...SCORE_KEYS.map((k) => r.parts[k].toFixed(2)),
      ...SCORE_KEYS.map((k) => r.creator.scores[k]),
    ]);
    downloadCsv("creator-fit-scores.csv", toCsv(headers, data));
  };

  return (
    <>
      <PageHeader
        title="Creator Fit Scoring"
        subtitle="A 100-point model. Move the sliders to change what matters; weights are rescaled to total 100 and the ranking updates instantly."
        actions={
          <>
            <button className="btn" onClick={() => setWeights({ ...DEFAULT_WEIGHTS })}>
              <RotateCcw className="h-4 w-4" aria-hidden /> Reset weights
            </button>
            <button className="btn" onClick={exportCsv}>
              <Download className="h-4 w-4" aria-hidden /> Export CSV
            </button>
          </>
        }
      />
      <Banner>
        Score inputs (0 to 10) are analyst estimates in <code>src/data/creators.json</code>, not measured data.
        View consistency is a neutral placeholder of 5 for every creator until recent view data is verified, so
        it does not currently separate creators.
      </Banner>

      <div className="mb-5 grid gap-5 lg:grid-cols-3">
        <Card title="Weights" note={`Slider total: ${total}. Effective weights are rescaled to 100.`} className="lg:col-span-1">
          <div className="space-y-5">
            {SCORE_KEYS.map((k) => (
              <div key={k}>
                <div className="flex items-baseline justify-between text-sm">
                  <label htmlFor={`w-${k}`} className="font-medium text-ink-800">{DIMENSIONS[k].label}</label>
                  <span className="tabular-nums text-ink-700">
                    {weights[k]} <span className="text-xs text-ink-400">→ {nw[k].toFixed(1)}</span>
                  </span>
                </div>
                <input
                  id={`w-${k}`}
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={weights[k]}
                  onChange={(e) => setWeights({ ...weights, [k]: Number(e.target.value) })}
                  className="mt-1 w-full accent-brand-600"
                />
                <p className="text-xs text-ink-500">{DIMENSIONS[k].explain}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Score composition, top 10" note="Points contributed by each dimension" className="lg:col-span-2">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceff4" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#5b6a82" }} />
                <YAxis type="category" dataKey="name" width={170} tick={{ fontSize: 12, fill: "#26364f" }} />
                <Tooltip />
                <Legend />
                {SCORE_KEYS.map((k, i) => (
                  <Bar key={k} dataKey={DIMENSIONS[k].short} stackId="s" fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="no-print mb-3 flex items-center gap-3">
        <label className="label" htmlFor="cat">Filter</label>
        <select id="cat" className="input max-w-[200px]" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="text-sm text-ink-500">{rows.length} creators</span>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th className="th">Rank</th>
              <th className="th">Creator</th>
              <th className="th">Category</th>
              {SCORE_KEYS.map((k) => <th key={k} className="th text-right">{DIMENSIONS[k].short}</th>)}
              <th className="th text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isOpen = open === r.creator.id;
              return (
                <Fragment key={r.creator.id}>
                  <tr className="hover:bg-ink-50/60">
                    <td className="td font-semibold">#{r.rank}</td>
                    <td className="td">
                      <button className="flex items-center gap-1.5 text-left font-medium text-ink-900 hover:text-brand-700" onClick={() => setOpen(isOpen ? null : r.creator.id)} aria-expanded={isOpen}>
                        {isOpen ? <ChevronDown className="h-4 w-4" aria-hidden /> : <ChevronRight className="h-4 w-4" aria-hidden />}
                        {r.creator.name}
                      </button>
                    </td>
                    <td className="td"><Badge tone="blue">{r.creator.category}</Badge></td>
                    {SCORE_KEYS.map((k) => <td key={k} className="td text-right tabular-nums">{r.parts[k].toFixed(1)}</td>)}
                    <td className="td text-right text-base font-semibold tabular-nums">{r.total.toFixed(1)}</td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-brand-50/40">
                      <td className="td" colSpan={9}>
                        <p className="text-sm text-ink-800">{explainScore(r, weights)}</p>
                        <p className="mt-2 text-xs text-ink-600">
                          Inputs (0 to 10): {SCORE_KEYS.map((k) => `${DIMENSIONS[k].short} ${r.creator.scores[k]}`).join(" · ")}
                        </p>
                        <p className="mt-1 text-xs text-ink-500">{r.creator.scoreBasis}</p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
