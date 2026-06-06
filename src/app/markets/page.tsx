import { Header } from "@/components/marketlab/header";
import { MarketCard } from "@/components/marketlab/market-card";
import { MarketsEmptyState } from "@/components/marketlab/markets-empty-state";
import { getMarkets } from "@/lib/markets/queries";

export default async function MarketsPage() {
  const markets = await getMarkets();

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Markets
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Browse fictional Yes/No markets using fake money.
          </p>
        </div>

        {markets.length === 0 ? (
          <MarketsEmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
