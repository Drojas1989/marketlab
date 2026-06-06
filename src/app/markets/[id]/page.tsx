import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FakeMoneyNote } from "@/components/marketlab/fake-money-note";
import { MarketBuySection } from "@/components/marketlab/market-buy-section";
import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { OutcomeStat } from "@/components/marketlab/outcome-stat";
import { PageShell } from "@/components/marketlab/page-shell";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCloseDate, formatYesChancePercent } from "@/lib/markets/format";
import { getMarketProbabilityData } from "@/lib/markets/probability.server";
import { getMarketById } from "@/lib/markets/queries";

type MarketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketDetailPage({
  params,
}: MarketDetailPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    notFound();
  }

  const probability = await getMarketProbabilityData(
    market.id,
    market.created_at,
  );

  return (
    <PageShell>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5">
          <Link href="/markets">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to markets
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <CardTitle className="text-2xl sm:text-3xl">
                  {market.title}
                </CardTitle>
                <MarketStatusBadge status={market.status} />
              </div>
              <CardDescription className="text-base leading-relaxed">
                {market.description ?? "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Closes {formatCloseDate(market.close_date)}
              </p>
              <FakeMoneyNote />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outcomes</CardTitle>
              <CardDescription>
                Current Yes/No sentiment from available position data.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <OutcomeStat
                side="yes"
                label="Yes"
                value={formatYesChancePercent(probability.yesChance)}
              />
              <OutcomeStat
                side="no"
                label="No"
                value={formatYesChancePercent(probability.noChance)}
              />
            </CardContent>
          </Card>

          <ProbabilityChart
            yesChance={probability.yesChance}
            points={probability.points}
            seriesMode={probability.seriesMode}
            seriesLabel={probability.seriesLabel}
            source={probability.source}
          />
        </div>

        <div className="lg:sticky lg:top-24">
          <MarketBuySection market={market} />
        </div>
      </div>
    </PageShell>
  );
}
