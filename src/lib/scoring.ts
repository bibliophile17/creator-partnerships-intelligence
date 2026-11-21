import type { Creator, ScoredCreator, ScoreKey, Weights } from "./types";

export const SCORE_KEYS: ScoreKey[] = [
  "audience",
  "content",
  "consistency",
  "suitability",
  "integration",
];

export const DEFAULT_WEIGHTS: Weights = {
  audience: 30,
  content: 25,
  consistency: 20,
  suitability: 15,
  integration: 10,
};

export const DIMENSIONS: Record<
  ScoreKey,
  { label: string; short: string; explain: string }
> = {
  audience: {
    label: "Audience relevance",
    short: "Audience",
    explain:
      "How closely the creator's likely audience matches the target buyer. Demographics are not verified for any creator, so this is an analyst estimate.",
  },
  content: {
    label: "Content relevance",
    short: "Content",
    explain:
      "How naturally the creator's topics connect to the campaign theme (sleep, home, wellbeing).",
  },
  consistency: {
    label: "View consistency",
    short: "Consistency",
    explain:
      "How stable the creator's recent video views are. Left at a neutral 5 until recent view data is verified.",
  },
  suitability: {
    label: "Brand suitability",
    short: "Suitability",
    explain:
      "Fit with brand safety and claims risk. Higher means lower risk of misalignment.",
  },
  integration: {
    label: "Integration potential",
    short: "Integration",
    explain:
      "How easily a product can be woven into the creator's existing formats.",
  },
};

export function sumWeights(w: Weights): number {
  return SCORE_KEYS.reduce((s, k) => s + (Number.isFinite(w[k]) ? w[k] : 0), 0);
}

/** Rescales weights so they always add up to 100. Falls back to defaults if all are zero. */
export function normalizeWeights(w: Weights): Weights {
  const total = sumWeights(w);
  if (total <= 0) return { ...DEFAULT_WEIGHTS };
  const out = {} as Weights;
  for (const k of SCORE_KEYS) out[k] = (Math.max(0, w[k]) * 100) / total;
  return out;
}

export function clampScore(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(10, Math.max(0, n));
}

export function scoreCreator(c: Creator, w: Weights) {
  const nw = normalizeWeights(w);
  const parts = {} as Record<ScoreKey, number>;
  let total = 0;
  for (const k of SCORE_KEYS) {
    parts[k] = (clampScore(c.scores[k]) / 10) * nw[k];
    total += parts[k];
  }
  return { parts, total };
}

export function rankCreators(creators: Creator[], w: Weights): ScoredCreator[] {
  const scored = creators.map((creator) => {
    const { parts, total } = scoreCreator(creator, w);
    return { creator, parts, total, rank: 0 };
  });
  scored.sort(
    (a, b) => b.total - a.total || a.creator.name.localeCompare(b.creator.name)
  );
  scored.forEach((s, i) => (s.rank = i + 1));
  return scored;
}

/** Plain-language explanation of a score, built from the numbers only. */
export function explainScore(s: ScoredCreator, w: Weights): string {
  const nw = normalizeWeights(w);
  const ratio = (k: ScoreKey) => (nw[k] > 0 ? s.parts[k] / nw[k] : 0);
  const keys = [...SCORE_KEYS].sort((a, b) => s.parts[b] - s.parts[a]);
  const strongest = keys[0];
  const weakest = [...SCORE_KEYS]
    .filter((k) => nw[k] > 0)
    .sort((a, b) => ratio(a) - ratio(b))[0];
  const parts: string[] = [
    `${s.creator.name} scores ${s.total.toFixed(1)} out of 100 (rank ${s.rank}).`,
    `Largest contribution: ${DIMENSIONS[strongest].label} (${s.parts[strongest].toFixed(1)} points).`,
  ];
  if (weakest) {
    parts.push(
      `Weakest relative area: ${DIMENSIONS[weakest].label} (${s.creator.scores[weakest]}/10).`
    );
  }
  parts.push(
    "Inputs are analyst estimates, not measured data, so treat the rank as a starting point for verification."
  );
  return parts.join(" ");
}
