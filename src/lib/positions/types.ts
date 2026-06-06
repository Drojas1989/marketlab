import type { MarketStatus } from "@/lib/markets/types";

export type PositionWithMarket = {
  id: string;
  market_id: string;
  yes_shares_cents: number;
  no_shares_cents: number;
  market: {
    id: string;
    title: string;
    status: MarketStatus;
    close_date: string | null;
  };
};

export function totalSharesCents(position: {
  yes_shares_cents: number;
  no_shares_cents: number;
}): number {
  return position.yes_shares_cents + position.no_shares_cents;
}
