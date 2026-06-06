import type { Market, MarketStatus } from "@/lib/markets/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function toMarket(row: {
  id: string;
  title: string;
  description: string | null;
  status: string;
  close_date: string | null;
  created_at: string;
  updated_at: string;
}): Market {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as MarketStatus,
    close_date: row.close_date,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getMarkets(): Promise<Market[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(toMarket);
}

export async function getMarketById(id: string): Promise<Market | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return toMarket(data);
}
