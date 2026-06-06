import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isMarketBuyable } from "@/lib/markets/buyable";
import type { Market } from "@/lib/markets/types";

type MarketBuyPlaceholderProps = {
  market: Market;
};

export function MarketBuyPlaceholder({ market }: MarketBuyPlaceholderProps) {
  const buyable = isMarketBuyable(market);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade</CardTitle>
        <CardDescription>
          {buyable
            ? "Buying and selling will be available in a later workshop slice."
            : "This market is not open for new trades."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={!buyable} className="flex-1">
          Buy Yes
        </Button>
        <Button disabled={!buyable} variant="outline" className="flex-1">
          Buy No
        </Button>
      </CardContent>
    </Card>
  );
}
