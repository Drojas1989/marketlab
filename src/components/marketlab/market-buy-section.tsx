import { MarketBuyForm } from "@/components/marketlab/market-buy-form";
import { isMarketBuyable } from "@/lib/markets/buyable";
import type { Market } from "@/lib/markets/types";
import { getPositionForMarket } from "@/lib/positions/queries";
import { getCurrentUserProfile } from "@/lib/profile/queries";

type MarketBuySectionProps = {
  market: Market;
};

export async function MarketBuySection({ market }: MarketBuySectionProps) {
  const { user, profile } = await getCurrentUserProfile();
  const position = user ? await getPositionForMarket(market.id) : null;

  return (
    <MarketBuyForm
      marketId={market.id}
      buyable={isMarketBuyable(market)}
      signedIn={Boolean(user)}
      balanceCents={profile?.balance_cents ?? null}
      yesSharesCents={position?.yes_shares_cents ?? 0}
      noSharesCents={position?.no_shares_cents ?? 0}
      signInHref="/sign-in"
    />
  );
}
