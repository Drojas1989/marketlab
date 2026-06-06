import type { User } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  balance_cents: number;
  first_name: string;
  last_name: string;
};

export async function getCurrentUserProfile(): Promise<{
  user: User | null;
  profile: Profile | null;
}> {
  if (!isSupabaseConfigured) {
    return { user: null, profile: null };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, balance_cents, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return { user, profile: null };
  }

  return { user, profile };
}
