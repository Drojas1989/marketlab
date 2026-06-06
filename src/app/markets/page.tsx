import { FakeMoneyChips } from "@/components/marketlab/fake-money-chips";
import { MarketCard } from "@/components/marketlab/market-card";
import { MarketsEmptyState } from "@/components/marketlab/markets-empty-state";
import { PageIntro } from "@/components/marketlab/page-intro";
import { PageShell } from "@/components/marketlab/page-shell";
import { getMarkets } from "@/lib/markets/queries";

export default async function MarketsPage() {
  const markets = await getMarkets();

  return (
    <PageShell>
      <PageIntro
        title="Markets"
        description="Browse fictional Yes/No markets using fake money."
      >
        <FakeMoneyChips />
      </PageIntro>

      {markets.length === 0 ? (
        <MarketsEmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
