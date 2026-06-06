"use server";

import { revalidatePath } from "next/cache";

import { isValidPositionSide, parseFakeDollarInput } from "@/lib/fake-money";
import type { BuyActionState } from "@/lib/markets/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function mapBuyError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("not authenticated")) {
    return "Sign in to buy fake shares.";
  }

  if (normalized.includes("invalid side")) {
    return "Choose Yes or No.";
  }

  if (normalized.includes("invalid amount")) {
    return "Enter a valid fake dollar amount.";
  }

  if (normalized.includes("market not found")) {
    return "This market could not be found.";
  }

  if (normalized.includes("market not buyable")) {
    return "This market is not open for new fake-money buys.";
  }

  if (normalized.includes("insufficient balance")) {
    return "You do not have enough fake balance for this buy.";
  }

  if (normalized.includes("profile not found")) {
    return "Your fake-money profile is unavailable.";
  }

  return "Could not complete this fake-money buy. Try again.";
}

export async function buyMarketShares(
  _prevState: BuyActionState | null,
  formData: FormData,
): Promise<BuyActionState> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const marketId = getFormString(formData, "market_id");
  const side = getFormString(formData, "side");
  const amount = getFormString(formData, "amount");

  if (!marketId) {
    return { error: "This market could not be found." };
  }

  if (!isValidPositionSide(side)) {
    return { error: "Choose Yes or No." };
  }

  const parsedAmount = parseFakeDollarInput(amount);

  if (!parsedAmount.ok) {
    return { error: parsedAmount.error };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in to buy fake shares." };
  }

  const { data, error } = await supabase.rpc("buy_market_shares", {
    p_market_id: marketId,
    p_side: side,
    p_amount_cents: parsedAmount.cents,
  });

  if (error) {
    return { error: mapBuyError(error.message) };
  }

  if (!data || typeof data !== "object" || !("ok" in data) || !data.ok) {
    return { error: "Could not complete this fake-money buy. Try again." };
  }

  revalidatePath(`/markets/${marketId}`);
  revalidatePath("/positions");
  revalidatePath("/", "layout");

  const sideLabel = side === "yes" ? "Yes" : "No";

  return {
    success: `Bought ${sideLabel} fake shares. Your balance and position were updated.`,
  };
}
