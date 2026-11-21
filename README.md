# Creator Partnerships Intelligence

**An independent creator intelligence and brand partnership strategy workbench for the Indian YouTube market.**
Research Indian creators, score their fit for a campaign, structure a brand deal, and model campaign performance, with every data point labelled as verified, estimated, unavailable, hypothetical or simulated.

> **Disclaimer.** This is an independent portfolio project built from publicly available information and hypothetical campaign scenarios. It is not affiliated with, endorsed by, or prepared for YouTube, Google, Wakefit or any creator named in it. The Wakefit campaign is a hypothetical case study, not an actual partnership. See [Data Integrity & Disclaimers](#10-data-integrity--disclaimers).

---

## Contents

1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [Creator Evaluation Framework](#3-creator-evaluation-framework)
4. [Campaign Strategy](#4-campaign-strategy)
5. [Analytics & Measurement](#5-analytics--measurement)
6. [Technology Stack](#6-technology-stack)
7. [Project Structure](#7-project-structure)
8. [Installation & Local Setup](#8-installation--local-setup)
9. [Data Sources & Research Methodology](#9-data-sources--research-methodology)
10. [Data Integrity & Disclaimers](#10-data-integrity--disclaimers)
11. [Future Improvements](#11-future-improvements)

---

## 1. Project Overview

**Purpose.** To show how a partnerships team could evaluate Indian YouTube creators and plan a brand campaign in a structured, transparent and auditable way.

**Problem.** Creator selection for a considered-purchase category (such as sleep and home products) is often informal. Creator data is scattered across third-party tools, its quality is uneven, fit is judged by instinct, and campaign economics are modelled late. It is also easy for unverified numbers to be presented as fact.

**Solution.** A single web application that combines:

- a 20-creator research database across Home, Lifestyle, Wellness and Technology that marks every unverified field as _Not verified_;
- an adjustable 100-point fit-scoring model with live re-ranking and plain-language explanations;
- a hypothetical brand deal proposal, "Better Sleep, Better Living", that can be printed or saved as PDF;
- a campaign calculator driven by editable, clearly simulated assumptions;
- a market intelligence section that keeps sourced facts, hypotheses and recommendations visibly separate.

The app runs entirely in the browser on local JSON files. It needs no API keys, database, backend services or AI service at runtime.

## 2. Key Features

| Module                             | What it does                                                                                                                                                                                                                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Executive Overview**             | Summary statistics, a data-verification count, and three switchable views (Portfolio, Fit scores, Campaign) with charts.                                                                                                                                                                                |
| **India Creator Intelligence**     | Search by name, handle, format or opportunity; filter by category and language; sort by fit score, subscribers, name or category; expand a row for sources, notes and research date; compare selected creators; export the filtered list to CSV.                                                        |
| **Creator Comparison**             | Compare 2 to 4 creators side by side in a table and radar chart, with score contributions per dimension; export to CSV.                                                                                                                                                                                 |
| **Creator Fit Scoring**            | Five weight sliders (weights are rescaled to total 100), live ranking, stacked score-composition chart, category filter, per-creator explanation, reset to defaults, CSV export.                                                                                                                        |
| **Brand Deal Strategy**            | Hypothetical campaign proposal covering objectives, audience hypotheses, a creator shortlist driven by the live scores, integration ideas, deliverables, timeline, usage rights, exclusivity, brand safety, illustrative budget split and negotiation points. Print or save as PDF through the browser. |
| **Campaign Performance Analytics** | Editable assumptions for six simulated line items plus average order value; all metrics recalculate immediately; chart of spend versus revenue; formulas listed on the page; reset to sample; CSV export.                                                                                               |
| **Market Intelligence**            | Sourced findings filtered by type (fact, hypothesis, recommendation) and grouped by theme, each with a source link, access date and evidence note.                                                                                                                                                      |
| **Strategic Recommendations**      | Six recommendations, each stating its basis. The shortlist and ROAS references update with your weights and assumptions.                                                                                                                                                                                |
| **Methodology & Sources**          | Status-label definitions, collection method, live effective weights, known limitations and the source list.                                                                                                                                                                                             |

Navigation state is kept in the URL hash, so a view can be bookmarked. The layout is responsive for desktop and mobile.

## 3. Creator Evaluation Framework

Each creator is scored on five dimensions. Each input is a 0 to 10 analyst estimate stored in `src/data/creators.json`; the model converts them into a 100-point score.

| Dimension             | Default weight | What it asks                                                        |
| --------------------- | -------------: | ------------------------------------------------------------------- |
| Audience relevance    |             30 | How closely the creator's likely audience matches the target buyer. |
| Content relevance     |             25 | How naturally the creator's topics connect to the campaign theme.   |
| View consistency      |             20 | How stable recent video views are.                                  |
| Brand suitability     |             15 | Fit with brand safety and claims risk (higher means lower risk).    |
| Integration potential |             10 | How easily a product can be woven into the creator's formats.       |
| **Total**             |        **100** |                                                                     |

**Formula**

```
effective_weight[k] = weight[k] x 100 / sum(weights)     (defaults used if all weights are 0)
points[k]           = (input[k] / 10) x effective_weight[k]
score               = sum of points[k]                    (0 to 100)
```

A creator scoring 10 on every dimension receives 100; one scoring 5 on every dimension receives 50. Weights can be changed in the app, and the ranking updates immediately.

**Important limits of the current scores**

- Inputs are analyst judgements, not measured data. No audience demographics are verified, so _audience relevance_ is the weakest input.
- _View consistency_ is set to a neutral 5 for every creator because recent view data has not been verified. It does not yet separate creators.
- The ranking is a starting point for verification, not a finding about creator quality.

## 4. Campaign Strategy

**Hypothetical case study: "Better Sleep, Better Living"**, using Wakefit as an example brand. This is a planning exercise. There is no partnership, no engagement with Wakefit, and no claim that any listed creator has worked with the brand.

| Element                | Summary (all hypothetical)                                                                                                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Objectives             | Build awareness among home-makers; drive considered-purchase intent through long-form integrations; generate trackable offer redemptions; learn which categories and languages merit a second phase. |
| Audience hypotheses    | Young households furnishing a home; urban professionals interested in sleep quality; Tier 2 and Tier 3 shoppers who prefer content in their own language. None are validated with audience data.     |
| Creator shortlist      | Top six by current fit score (technology creators excluded by default, toggle available).                                                                                                            |
| Integration ideas      | Bedroom makeover, evening routine, sleep explainer, regional-language test cell.                                                                                                                     |
| Deliverables           | Six long-form integrations, two Shorts each, trackable offer code, day-7 and day-30 reports.                                                                                                         |
| Timeline               | 12 weeks from verification and briefing to reporting.                                                                                                                                                |
| Usage rights           | Three months organic usage; paid usage priced separately; creator keeps ownership.                                                                                                                   |
| Exclusivity            | Category exclusivity of 30 days either side of publishing, priced by scope.                                                                                                                          |
| Brand safety           | Back-catalogue review, paid-promotion disclosure, pre-approved claims, extra scrutiny for health-professional channels.                                                                              |
| Commercial assumptions | Illustrative split of the simulated budget: 70% creator fees, 12% usage rights, 10% paid amplification, 8% seeding and contingency. These are not market rates.                                      |
| Negotiation            | Anchor on verified outcomes, trade usage length against fee, seek performance bonuses, pilot before scaling.                                                                                         |

Disclosure and advertising requirements should be confirmed with qualified counsel before any real campaign.

## 5. Analytics & Measurement

All campaign analytics use **simulated data**. The sample inputs are in `src/data/campaign.json` (a copy is in `data/sample-campaign.json`): six generic line items and an average order value of ₹18,000.

| Metric             | Formula                                              |
| ------------------ | ---------------------------------------------------- |
| Views              | Impressions x view rate                              |
| Watch time (hours) | Views x average view duration ÷ 3,600                |
| Retention          | Average view duration ÷ video length, capped at 100% |
| Clicks             | Views x CTR                                          |
| Conversions        | Clicks x conversion rate                             |
| Revenue            | Conversions x average order value                    |
| CPV                | Spend ÷ views                                        |
| CPM                | Spend ÷ impressions x 1,000                          |
| CPC                | Spend ÷ clicks                                       |
| CPA                | Spend ÷ conversions                                  |
| ROAS               | Revenue ÷ spend                                      |

- Totals are summed, and ratio metrics are recomputed from totals rather than averaged. Total retention is Σ(views x duration) ÷ Σ(views x video length).
- A metric with a zero denominator shows a dash instead of an error.
- Revenue assumes every conversion is an order at the average order value; it ignores returns, discounts and margin.

**Default simulated output** (illustrative, not a forecast): spend ₹25,00,000; about 945,500 views; about 376 conversions; CPA about ₹6,650; ROAS 2.71x.

`npm test` checks the formulas against hand-computed values (26 checks).

## 6. Technology Stack

| Area       | Technology                                 | Version |
| ---------- | ------------------------------------------ | ------- |
| Framework  | Next.js (App Router)                       | 14.2.15 |
| UI library | React                                      | 18.3.1  |
| Language   | TypeScript                                 | 5.6.2   |
| Styling    | Tailwind CSS with PostCSS and Autoprefixer | 3.4.13  |
| Charts     | Recharts                                   | 2.12.7  |
| Icons      | lucide-react                               | 0.441.0 |
| Data       | Local JSON and CSV files                   | n/a     |
| Tooling    | Node.js (18.17 or newer), npm              | n/a     |

No external APIs, databases, authentication, analytics or paid services are used. The case study PDF in `docs/` was generated separately with Python and ReportLab; these are not needed to run the app.

## 7. Project Structure

```
creator-partnerships-intelligence/
├── src/
│   ├── app/                  Next.js entry: layout.tsx, page.tsx, globals.css (incl. print styles)
│   ├── components/
│   │   ├── App.tsx           App shell, navigation and shared state (weights, selection, campaign inputs)
│   │   ├── ui.tsx            Shared components: cards, badges, banners, tabs, chart colours
│   │   └── views/            One file per module (Overview, Creators, Compare, Scoring,
│   │                         Strategy, Campaign, Market, Recommendations, Methodology)
│   ├── lib/
│   │   ├── scoring.ts        Weight normalisation, scoring, ranking, explanations
│   │   ├── campaign.ts       Campaign formulas (per line and totals)
│   │   ├── format.ts         Number, currency and percentage formatting
│   │   ├── csv.ts            CSV building and browser download
│   │   └── types.ts          Shared TypeScript types
│   └── data/
│       ├── creators.json     Creator database (source of truth)
│       ├── campaign.json     Simulated campaign inputs
│       └── market.json       Market findings, typed fact / hypothesis / recommendation
├── data/
│   ├── creators.csv          Spreadsheet export of creators.json (regenerate with npm run csv)
│   └── sample-campaign.json  Copy of the simulated campaign inputs
├── docs/
│   ├── METHODOLOGY.md        Detailed methodology and limitations
│   ├── DATA_SOURCES.md       Source list with access dates and read status
│   └── executive-case-study.pdf   Three-page summary of the project
├── scripts/
│   ├── verify-calculations.mjs    Checks scoring and campaign maths (npm test)
│   └── json-to-csv.mjs            Regenerates data/creators.csv
└── package.json, tsconfig.json, tailwind.config.ts, next.config.mjs, postcss.config.mjs
```

`src/data/creators.json` is the only source the app reads for creators. Editing `data/creators.csv` does **not** change the app.

## 8. Installation & Local Setup

**Requirements:** [Node.js](https://nodejs.org) 18.17 or newer (LTS recommended) and npm, which is included with Node.js.

### Windows (PowerShell or the VS Code terminal)

```powershell
git clone https://github.com/<your-username>/creator-partnerships-intelligence.git
cd creator-partnerships-intelligence
node -v
npm install
npm run dev
```

Open <http://localhost:3000>. If you downloaded a ZIP instead, extract it, open the folder in VS Code and start from `npm install`.

If PowerShell blocks `npm` with an execution-policy error, use `npm.cmd install` and `npm.cmd run dev`, or use Command Prompt.

### macOS and Linux

```bash
git clone https://github.com/<your-username>/creator-partnerships-intelligence.git
cd creator-partnerships-intelligence
npm install
npm run dev
```

### Scripts

| Command             | Purpose                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| `npm run dev`       | Start the development server at http://localhost:3000                   |
| `npm run build`     | Create a production build                                               |
| `npm start`         | Serve the production build (run `npm run build` first)                  |
| `npm run typecheck` | Run the TypeScript compiler without emitting files                      |
| `npm test`          | Verify scoring and campaign calculations (requires `npm install` first) |
| `npm run csv`       | Regenerate `data/creators.csv` from `src/data/creators.json`            |

### Updating the data

Edit `src/data/creators.json` and save; the dev server reloads. Per creator you can set `subscribers` (number or `null`), `recentVideoViews` (number or `null`), `brandIntegrations`, the five `scores` inputs, `sourceLinks` and `researchDate`. Run `npm run csv` afterwards to refresh the CSV.

### Deployment (optional)

The project can be deployed on the Vercel free tier by importing the repository. No environment variables are required.

> **Status note.** The calculation tests (`npm test`) were run and pass. The full application build, type-check and browser interaction testing were not run in the environment where the project was authored, because package installation was unavailable. If `npm run typecheck` or `npm run build` reports an issue on your machine, please open an issue.

## 9. Data Sources & Research Methodology

Research was collected on **21 November 2026**.

**Creator data**

- Creators were drawn from third-party aggregator listing pages: Modash (Interior Design, Health, Fitness, DIY and Productivity categories) and Heepsy (Tech). Modash pages display "Last updated 11/09/2026", a date format that is ambiguous. The Heepsy page displays 1 November 2026.
- Subscriber counts are the aggregators' figures and were **not checked on YouTube**. Two technology entries come from a column the source labels "followers".
- Channel links use the handle printed on the aggregator page. Two entries have no handle, so they link to a YouTube search and are flagged in the app.
- Languages are the aggregator's inference from titles or bios where given; otherwise _Not verified_.
- Category assignment is partly the author's. Some creators were listed under a neighbouring category (for example DIY or Productivity) on the source page, so the category fit is loose.
- Not collected: recent video views, brand integrations, audience demographics and engagement.

**Market intelligence**

- Findings come from the pages listed in [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md): press coverage of an Oxford Economics study on YouTube's economic impact in India, and official YouTube India announcements on creator and brand tools.
- Each item records whether the page body was read or only a search headline was seen. Headline-only items are labelled and should be read in full before being cited.

**Assumptions and limitations**

- Fit-score inputs are estimates; scores will change materially once real data replaces them.
- Commercial and campaign assumptions are illustrative, not market rates.
- Some market figures are dated (for example a 2020 Hindi viewing share) or global rather than India-specific.
- The dataset is a snapshot, not a live feed.

Full detail is in [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md).

## 10. Data Integrity & Disclaimers

| Category                          | Meaning                                                                        | Where it appears                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Sourced fact**                  | Taken from a linked page, with access date. Some are headline-only and say so. | Market Intelligence; creator names, handles and aggregator subscriber counts             |
| **Estimate (analyst assessment)** | A judgement used as a scoring input. Not measured.                             | The 0 to 10 score inputs; brand suitability notes                                        |
| **Not verified / unavailable**    | Could not be confirmed, so left blank rather than estimated.                   | Recent video views, brand integrations, demographics, most languages                     |
| **Hypothesis**                    | An inference to be tested.                                                     | Content formats, partnership opportunities, audience hypotheses, regional-language ideas |
| **Simulated**                     | Illustrative numbers with no real campaign behind them.                        | All of Campaign Performance Analytics and the ROAS shown elsewhere                       |

**Disclaimer.** This is an independent portfolio project using publicly available information and hypothetical campaign scenarios.

- It is not affiliated with, endorsed by, or prepared for YouTube, Google, Wakefit or any creator.
- It does not claim that any creator has worked with Wakefit or any other brand, and no creator endorsement is stated or implied.
- Creator metrics are third-party, unconfirmed and may be out of date. Verify directly on YouTube before relying on them.
- Nothing here is financial, legal or advertising-compliance advice.
- Company and channel names are used only to identify publicly listed entities. Trademarks belong to their owners.

## 11. Future Improvements

Realistic next steps, none of which are implemented today:

- Verify each creator on YouTube and fill recent views, languages and sponsored-content history, then replace the neutral consistency placeholder with a calculated value.
- Add a scoring input derived from measured data (for example the median of recent long-form views) alongside analyst judgement.
- Add data-validation for `creators.json` so edits that break the schema are caught early.
- Add component and interaction tests, plus a CI workflow for typecheck, build and `npm test`.
- Let users import their own creator CSV and save scenarios locally.
- Add screenshots to the repository and this README.
- Add a pilot-tracking mode to replace simulated campaign inputs with measured results.
- Expand the market section with fully read primary sources and add more regional languages.

---

_Independent portfolio project. All campaign data is simulated and the Wakefit campaign is hypothetical._
