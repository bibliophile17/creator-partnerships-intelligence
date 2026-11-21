import type { CampaignLine, LineResult } from "./types";

function safeDiv(a: number, b: number): number | null {
  return b > 0 && Number.isFinite(a) && Number.isFinite(b) ? a / b : null;
}

function num(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Formulas (all inputs are editable assumptions):
 * views        = impressions x view rate
 * watch hours  = views x avg view duration / 3600
 * retention    = avg view duration / video length (capped at 100%)
 * clicks       = views x CTR
 * conversions  = clicks x conversion rate
 * revenue      = conversions x average order value
 * CPV = spend / views;  CPM = spend / impressions x 1000;  CPC = spend / clicks
 * CPA = spend / conversions;  ROAS = revenue / spend
 */
export function computeLine(l: CampaignLine, aovInr: number): LineResult {
  const spend = num(l.spendInr);
  const impressions = num(l.impressions);
  const views = impressions * (num(l.viewRatePct) / 100);
  const watchHours = (views * num(l.avdSec)) / 3600;
  const retentionPct =
    num(l.videoLenSec) > 0
      ? Math.min(100, (num(l.avdSec) / num(l.videoLenSec)) * 100)
      : 0;
  const clicks = views * (num(l.ctrPct) / 100);
  const conversions = clicks * (num(l.cvrPct) / 100);
  const revenueInr = conversions * num(aovInr);
  return {
    views,
    watchHours,
    retentionPct,
    clicks,
    conversions,
    revenueInr,
    cpv: safeDiv(spend, views),
    cpm: impressions > 0 ? (spend / impressions) * 1000 : null,
    cpc: safeDiv(spend, clicks),
    cpa: safeDiv(spend, conversions),
    roas: safeDiv(revenueInr, spend),
  };
}

export interface Totals extends LineResult {
  spendInr: number;
  impressions: number;
  ctrPct: number;
  viewRatePct: number;
}

/**
 * Totals are summed, and ratios are recomputed from the totals (not averaged),
 * so they stay correct when lines differ in size.
 * Retention = sum(views x AVD) / sum(views x video length).
 */
export function computeTotals(lines: CampaignLine[], aovInr: number): Totals {
  let spend = 0,
    impressions = 0,
    views = 0,
    watchSeconds = 0,
    viewSeconds = 0,
    clicks = 0,
    conversions = 0,
    revenue = 0;
  for (const l of lines) {
    const r = computeLine(l, aovInr);
    spend += num(l.spendInr);
    impressions += num(l.impressions);
    views += r.views;
    watchSeconds += r.views * num(l.avdSec);
    viewSeconds += r.views * num(l.videoLenSec);
    clicks += r.clicks;
    conversions += r.conversions;
    revenue += r.revenueInr;
  }
  return {
    spendInr: spend,
    impressions,
    views,
    watchHours: watchSeconds / 3600,
    retentionPct: viewSeconds > 0 ? Math.min(100, (watchSeconds / viewSeconds) * 100) : 0,
    clicks,
    conversions,
    revenueInr: revenue,
    cpv: safeDiv(spend, views),
    cpm: impressions > 0 ? (spend / impressions) * 1000 : null,
    cpc: safeDiv(spend, clicks),
    cpa: safeDiv(spend, conversions),
    roas: safeDiv(revenue, spend),
    ctrPct: views > 0 ? (clicks / views) * 100 : 0,
    viewRatePct: impressions > 0 ? (views / impressions) * 100 : 0,
  };
}
