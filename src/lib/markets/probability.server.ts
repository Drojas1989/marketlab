import "server-only";

import {
  buildChartSeries,
  buildLedgerHistoryPoints,
  resolveYesChance,
} from "@/lib/markets/probability";
import type { MarketProbabilityData } from "@/lib/markets/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type LedgerRow = {
  amount_cents: number;
  entry_type: string;
  description: string | null;
  created_at: string;
};

async function fetchPositionTotals(
  marketId: string,
): Promise<{ yesTotal: number; noTotal: number } | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("positions")
    .select("yes_shares_cents, no_shares_cents")
    .eq("market_id", marketId);

  if (error) {
    return null;
  }

  // Under current RLS, anon users see zero rows and authenticated users only
  // see their own position. Partial rows must not be treated as market totals.
  // A future security-definer RPC can return real aggregates here.
  return null;
}

async function fetchLedgerRows(marketId: string): Promise<LedgerRow[] | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("ledger_entries")
    .select("amount_cents, entry_type, description, created_at")
    .eq("market_id", marketId)
    .order("created_at", { ascending: true });

  if (error) {
    return null;
  }

  // Under current RLS, ledger rows are owner-scoped and cannot reconstruct
  // market-level history via the publishable client.
  return null;
}

export async function getMarketProbabilityData(
  marketId: string,
  createdAt: string,
): Promise<MarketProbabilityData> {
  const totals = await fetchPositionTotals(marketId);
  const { yesChance, source } = resolveYesChance(
    totals?.yesTotal ?? null,
    totals?.noTotal ?? null,
  );

  const ledgerRows = await fetchLedgerRows(marketId);
  const ledgerPoints =
    ledgerRows === null ? [] : buildLedgerHistoryPoints(ledgerRows);

  const series = buildChartSeries({
    createdAt,
    yesChance,
    ledgerPoints,
  });

  return {
    yesChance,
    noChance: 1 - yesChance,
    source,
    seriesMode: series.mode,
    seriesLabel: series.label,
    points: series.points,
  };
}
