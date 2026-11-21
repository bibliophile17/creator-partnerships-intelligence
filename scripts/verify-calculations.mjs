// Verifies scoring and campaign maths against hand-computed values.
// Run with: npm test   (requires `npm install` first so TypeScript is available)
import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = mkdtempSync(join(tmpdir(), "cpi-"));
mkdirSync(out, { recursive: true });

for (const f of ["scoring", "campaign"]) {
  const src = readFileSync(join(root, "src/lib", `${f}.ts`), "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  writeFileSync(join(out, `${f}.cjs`), js.replace(/require\("\.\/types"\)/g, "{}"));
}
const scoring = require(join(out, "scoring.cjs"));
const campaign = require(join(out, "campaign.cjs"));

let failed = 0;
function check(name, actual, expected, tol = 1e-6) {
  const ok =
    typeof expected === "number" && actual !== null
      ? Math.abs(actual - expected) <= tol
      : actual === expected;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  (got ${actual}, expected ${expected})`);
  if (!ok) failed++;
}

// ---- Scoring ----
const mk = (v) => ({ name: "x", scores: { audience: v, content: v, consistency: v, suitability: v, integration: v } });
check("all-10 creator scores 100", scoring.scoreCreator(mk(10), scoring.DEFAULT_WEIGHTS).total, 100);
check("all-5 creator scores 50", scoring.scoreCreator(mk(5), scoring.DEFAULT_WEIGHTS).total, 50);
check("default weights sum to 100", scoring.sumWeights(scoring.DEFAULT_WEIGHTS), 100);
const doubled = scoring.normalizeWeights({ audience: 60, content: 50, consistency: 40, suitability: 30, integration: 20 });
check("weights rescale to 100", scoring.sumWeights(doubled), 100);
check("rescaled audience weight is 30", doubled.audience, 30);
const mixed = { name: "m", scores: { audience: 8, content: 6, consistency: 5, suitability: 7, integration: 4 } };
// 0.8*30 + 0.6*25 + 0.5*20 + 0.7*15 + 0.4*10 = 24 + 15 + 10 + 10.5 + 4 = 63.5
check("mixed creator hand-computed 63.5", scoring.scoreCreator(mixed, scoring.DEFAULT_WEIGHTS).total, 63.5);
const allZero = scoring.normalizeWeights({ audience: 0, content: 0, consistency: 0, suitability: 0, integration: 0 });
check("all-zero weights fall back to default", allZero.audience, 30);
const ranked = scoring.rankCreators([mk(3), mk(9), mk(6)].map((c, i) => ({ ...c, name: "c" + i })), scoring.DEFAULT_WEIGHTS);
check("ranking puts highest score first", ranked[0].creator.name, "c1");

// ---- Campaign ----
const line = { id: "t", label: "t", category: "Home", spendInr: 100000, impressions: 1000000, viewRatePct: 10, avdSec: 180, videoLenSec: 600, ctrPct: 2, cvrPct: 5 };
const r = campaign.computeLine(line, 20000);
check("views = 1,000,000 x 10% = 100,000", r.views, 100000);
check("watch hours = 100,000 x 180 / 3600 = 5,000", r.watchHours, 5000);
check("retention = 180 / 600 = 30%", r.retentionPct, 30);
check("clicks = 100,000 x 2% = 2,000", r.clicks, 2000);
check("conversions = 2,000 x 5% = 100", r.conversions, 100);
check("revenue = 100 x 20,000 = 2,000,000", r.revenueInr, 2000000);
check("CPV = 100,000 / 100,000 = 1", r.cpv, 1);
check("CPM = 100,000 / 1,000,000 x 1000 = 100", r.cpm, 100);
check("CPC = 100,000 / 2,000 = 50", r.cpc, 50);
check("CPA = 100,000 / 100 = 1,000", r.cpa, 1000);
check("ROAS = 2,000,000 / 100,000 = 20", r.roas, 20);
const zero = campaign.computeLine({ ...line, impressions: 0 }, 20000);
check("zero impressions gives null CPV (no divide-by-zero)", zero.cpv, null);

const line2 = { ...line, spendInr: 300000, impressions: 2000000, viewRatePct: 5, avdSec: 60, videoLenSec: 300 };
const t = campaign.computeTotals([line, line2], 20000);
check("total spend", t.spendInr, 400000);
check("total views = 100,000 + 100,000", t.views, 200000);
// retention = (100000*180 + 100000*60) / (100000*600 + 100000*300) = 24,000,000 / 90,000,000 = 26.666..%
check("weighted retention", t.retentionPct, (24000000 / 90000000) * 100);
const r2 = campaign.computeLine(line2, 20000);
check("total ROAS = total revenue / total spend", t.roas, (r.revenueInr + r2.revenueInr) / 400000);

// ---- Shipped sample data ----
const sample = JSON.parse(readFileSync(join(root, "src/data/campaign.json"), "utf8"));
const st = campaign.computeTotals(sample.lines, sample.aovInr);
console.log(`INFO  sample campaign: spend ${st.spendInr}, views ${Math.round(st.views)}, conversions ${st.conversions.toFixed(1)}, ROAS ${st.roas.toFixed(2)}x`);
const creators = JSON.parse(readFileSync(join(root, "src/data/creators.json"), "utf8"));
check("20 creators in dataset", creators.length, 20);
check("every creator has a score in 0-10", creators.every((c) => Object.values(c.scores).every((v) => v >= 0 && v <= 10)), true);

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nAll checks passed");
