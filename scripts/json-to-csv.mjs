// Regenerates data/creators.csv from src/data/creators.json (the source of truth).
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const creators = JSON.parse(readFileSync(join(root, "src/data/creators.json"), "utf8"));

const esc = (v) => {
  const s = v === null || v === undefined ? "Not verified" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const cols = ["id", "name", "handle", "channelUrl", "category", "language", "subscribers", "subscribersAsOf", "recentVideoViews", "contentFormat", "brandIntegrations", "brandSuitability", "partnershipOpportunity", "researchDate"];
const scoreCols = ["audience", "content", "consistency", "suitability", "integration"];
const header = [...cols, "sourceLinks", ...scoreCols.map((k) => "score_" + k)];
const lines = [header.join(",")];
for (const c of creators) {
  lines.push(
    [...cols.map((k) => c[k]), c.sourceLinks.map((s) => s.url).join(" | "), ...scoreCols.map((k) => c.scores[k])]
      .map(esc)
      .join(",")
  );
}
writeFileSync(join(root, "data/creators.csv"), "﻿" + lines.join("\r\n"), "utf8");
console.log(`Wrote data/creators.csv (${creators.length} rows)`);
