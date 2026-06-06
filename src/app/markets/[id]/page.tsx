import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/marketlab/header";
import { MarketBuyPlaceholder } from "@/components/marketlab/market-buy-placeholder";
import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
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
import { getMarketProbabilityData } from "@/lib/markets/probability";
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
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/markets">← Back to markets</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
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
              <CardContent className="text-sm text-muted-foreground">
                Closes {formatCloseDate(market.close_date)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outcomes</CardTitle>
                <CardDescription>
                  Current market sentiment from available position data.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Yes
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {formatYesChancePercent(probability.yesChance)}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    No
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {formatYesChancePercent(probability.noChance)}
                  </p>
                </div>
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

          <div>
            <MarketBuyPlaceholder market={market} />
          </div>
        </div>
      </main>
    </div>
  );
}
