"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";

export interface SyncProfileInput {
  fullName?: string;
  phone?: string;
  highestQualification?: Database["public"]["Enums"]["qualification_level"];
  preferredLanguage?: string;
  spokenDialects?: string[];
  shortlistedTradeIds?: string[];
  district?: string;
  state?: string;
  goal?: string;
  workPreference?: string;
}

export async function saveLearnerProfileAction(input: SyncProfileInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "User not authenticated." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName,
      phone: input.phone,
      highest_qualification: input.highestQualification,
      preferred_language: input.preferredLanguage || "en",
      spoken_dialects: input.spokenDialects || ["bhojpuri"],
      shortlisted_trade_ids: input.shortlistedTradeIds || [],
      district: input.district,
      state: input.state,
      goal: input.goal,
      work_preference: input.workPreference,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/my-path");
  return { success: true };
}

export async function getLearnerProfileAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "User not authenticated.", profile: null };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return { error: error.message, profile: null };
  }

  return { profile };
}
