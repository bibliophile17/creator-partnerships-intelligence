"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import marketData from "@/data/market.json";
import type { MarketItem } from "@/lib/types";
import { Badge, Banner, Card, PageHeader, Segmented } from "../ui";

const ITEMS = marketData as MarketItem[];

type Filter = "all" | MarketItem["type"];

const TYPE_LABEL: Record<MarketItem["type"], string> = {
  fact: "Sourced fact",
  hypothesis: "Hypothesis",
  recommendation: "Recommendation",
};
const TYPE_TONE = { fact: "green", hypothesis: "amber", recommendation: "blue" } as const;

export default function Market() {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = useMemo(() => ITEMS.filter((i) => filter === "all" || i.type === filter), [filter]);
  const themes = useMemo(() => Array.from(new Set(shown.map((i) => i.theme))), [shown]);

  return (
    <>
      <PageHeader
        title="Market Intelligence"
        subtitle="Findings on the Indian creator ecosystem, creator partnerships, YouTube's brand partnership tools and regional-language opportunity. Facts, hypotheses and recommendations are labelled separately."
        actions={
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { id: "all", label: "All" },
              { id: "fact", label: "Facts" },
              { id: "hypothesis", label: "Hypotheses" },
              { id: "recommendation", label: "Recommendations" },
            ]}
          />
        }
      />
      <Banner tone="blue">
        Facts were read from the linked sources on 2026-11-21. Items marked <em>headline only</em> were seen in search
        results but the article body was not read; verify them before using them in an application.
      </Banner>

      <div className="space-y-5">
        {themes.map((theme) => (
          <Card key={theme} title={theme}>
            <ul className="divide-y divide-ink-100">
              {shown
                .filter((i) => i.theme === theme)
                .map((i) => (
                  <li key={i.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Badge tone={TYPE_TONE[i.type]}>{TYPE_LABEL[i.type]}</Badge>
                      <span className="text-xs text-ink-400">{i.id}</span>
                    </div>
                    <p className="text-sm text-ink-800">{i.statement}</p>
                    <p className="mt-1.5 text-xs text-ink-500">
                      {i.url ? (
                        <>
                          Source:{" "}
                          <a href={i.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                            {i.source} <ExternalLink className="h-3 w-3" aria-hidden />
                          </a>
                          {" · "}accessed {i.accessed}
                        </>
                      ) : (
                        <>{i.source}</>
                      )}
                      {" · "}
                      {i.evidence}
                    </p>
                  </li>
                ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
