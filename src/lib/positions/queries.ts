import "server-only";

import type { MarketStatus, PositionSnapshot } from "@/lib/markets/types";
import type { PositionWithMarket } from "@/lib/positions/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getPositionForMarket(
  marketId: string,
): Promise<PositionSnapshot | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("positions")
    .select("yes_shares_cents, no_shares_cents")
    .eq("market_id", marketId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    yes_shares_cents: data.yes_shares_cents,
    no_shares_cents: data.no_shares_cents,
  };
}

export async function getUserPositions(): Promise<PositionWithMarket[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("positions")
    .select(
      `
      id,
      market_id,
      yes_shares_cents,
      no_shares_cents,
      markets (
        id,
        title,
        status,
        close_date
      )
    `,
    )
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.flatMap((row) => {
    const marketData = row.markets;
    const market = Array.isArray(marketData) ? marketData[0] : marketData;

    if (!market) {
      return [];
    }

    return [
      {
        id: row.id,
        market_id: row.market_id,
        yes_shares_cents: row.yes_shares_cents,
        no_shares_cents: row.no_shares_cents,
        market: {
          id: market.id,
          title: market.title,
          status: market.status as MarketStatus,
          close_date: market.close_date,
        },
      },
    ];
  });
}
