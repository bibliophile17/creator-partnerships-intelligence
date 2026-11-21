# Methodology

## Purpose
A portfolio workbench for evaluating Indian YouTube creators and structuring a brand partnership, using a hypothetical campaign ("Better Sleep, Better Living", example brand Wakefit).

## Status labels
| Label | Meaning |
|---|---|
| Not verified | Could not be confirmed from a source read during research. Left blank rather than estimated. |
| Hypothesis | Analyst inference, for example a content format guessed from a channel name. |
| Analyst assessment | A judgement used as a scoring input. Not measured. |
| Sourced fact | Taken from a linked page, with date accessed. Some are headline-only and say so. |

## Creator research (collected 2026-11-21)
- Creators were drawn from third-party aggregator ranking pages (Modash, Heepsy). Modash shows "Last updated 11/09/2026", which is ambiguous (9 November or 11 September). Heepsy shows 1 November 2026.
- Subscriber counts are the aggregator's numbers and were not checked on YouTube. The two Heepsy entries (Technology Gyan, Tech Master) come from a column labelled "followers".
- Channel links use the handle printed on the aggregator page. Two entries had no handle and link to a YouTube search instead.
- Languages are the aggregator's inference from titles or bios where given; otherwise "Not verified".
- Category assignment is partly the analyst's. TechCM Shorts was listed under productivity; KL3tech and several lifestyle creators were listed under DIY. Fit with the assigned category is unconfirmed.
- Not collected: recent video views, brand integrations, audience demographics, engagement.

## Fit scoring
Dimensions and default weights: Audience relevance 30, Content relevance 25, View consistency 20, Brand suitability 15, Integration potential 10.

```
effective_weight[k] = weight[k] * 100 / sum(weights)       (falls back to defaults if all are zero)
points[k]           = (input[k] / 10) * effective_weight[k]
score               = sum(points)                          (0 to 100)
```

Inputs are 0 to 10 analyst estimates stored in `creators.json`. View consistency is a neutral 5 for every creator because no view data is verified, so it does not currently differentiate creators. Audience relevance has no demographic evidence behind it.

## Campaign model (simulated)
```
views        = impressions x view rate
watch hours  = views x avg view duration / 3600
retention    = avg view duration / video length (capped at 100%)
clicks       = views x CTR
conversions  = clicks x conversion rate
revenue      = conversions x average order value
CPV = spend / views    CPM = spend / impressions x 1000    CPC = spend / clicks
CPA = spend / conversions    ROAS = revenue / spend
```
Totals are summed and ratios recomputed from totals. Total retention = sum(views x AVD) / sum(views x length). Metrics with a zero denominator display a dash. Revenue ignores returns, discounts and margin. All inputs are illustrative.

Hand-computed checks are in `scripts/verify-calculations.mjs` (`npm test`).

## Market intelligence
Items are typed `fact`, `hypothesis` or `recommendation`. Facts cite a URL and access date and say whether the page body was read or only a search headline was seen.

## Limitations
- Creator data is research-stage; most fields beyond name, handle and aggregator subscribers are unverified.
- Scores are estimates and will change once real data is entered.
- Several market facts are headline-level and dated (for example the 2020 Hindi viewing share).
- Commercial assumptions in the strategy view are illustrative, not market rates.
- The app was written without being able to install dependencies or run a build in the authoring environment; see README.
