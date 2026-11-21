export type Category = "Home" | "Lifestyle" | "Wellness" | "Technology";

export type ScoreKey =
  | "audience"
  | "content"
  | "consistency"
  | "suitability"
  | "integration";

export type Weights = Record<ScoreKey, number>;

export interface SourceLink {
  label: string;
  url: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  channelUrl: string;
  channelLinkType: "handle-from-aggregator" | "search-link-only";
  category: Category;
  language: string;
  languageStatus: "inferred" | "not-verified";
  subscribers: number | null;
  subscribersAsOf: string;
  subscribersSource: string;
  subscribersNote: string;
  recentVideoViews: number | null;
  recentVideoViewsNote: string;
  contentFormat: string;
  contentFormatStatus: string;
  brandIntegrations: string;
  brandSuitability: string;
  brandSuitabilityStatus: string;
  partnershipOpportunity: string;
  partnershipOpportunityStatus: string;
  sourceLinks: SourceLink[];
  researchDate: string;
  scores: Record<ScoreKey, number>;
  scoreBasis: string;
}

export interface ScoredCreator {
  creator: Creator;
  parts: Record<ScoreKey, number>;
  total: number;
  rank: number;
}

export interface CampaignLine {
  id: string;
  label: string;
  category: string;
  spendInr: number;
  impressions: number;
  viewRatePct: number;
  avdSec: number;
  videoLenSec: number;
  ctrPct: number;
  cvrPct: number;
}

export interface LineResult {
  views: number;
  watchHours: number;
  retentionPct: number;
  clicks: number;
  conversions: number;
  revenueInr: number;
  cpv: number | null;
  cpm: number | null;
  cpc: number | null;
  cpa: number | null;
  roas: number | null;
}

export interface MarketItem {
  id: string;
  theme: string;
  type: "fact" | "hypothesis" | "recommendation";
  statement: string;
  source: string;
  url: string;
  accessed: string;
  evidence: string;
}
