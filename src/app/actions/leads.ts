"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CreateCallbackLeadInput {
  householdId?: string;
  parentName?: string;
  parentPhone: string;
  preferredDialect?: string;
  primaryResistance?: string;
  targetTradeId?: string;
  preferredTimeSlot?: string;
}

export async function requestCallbackAction(input: CreateCallbackLeadInput) {
  if (!input.parentPhone || input.parentPhone.trim().length < 10) {
    return { error: "Valid 10-digit phone number is required." };
  }

  const supabase = await createClient();

  // Find or create default household if none provided
  let targetHouseholdId = input.householdId;
  if (!targetHouseholdId) {
    const { data: household } = await supabase.from("households").select("id").limit(1).maybeSingle();
    if (household) {
      targetHouseholdId = household.id;
    }
  }

  if (!targetHouseholdId) {
    return { error: "No household record found." };
  }

  const { data, error } = await supabase
    .from("family_callbacks")
    .insert({
      household_id: targetHouseholdId,
      parent_phone: input.parentPhone.trim(),
      preferred_dialect: input.preferredDialect || "bhojpuri",
      target_trade_id: input.targetTradeId || "electrician",
      primary_resistance: input.primaryResistance || "Fee and placement security",
      preferred_time_slot: input.preferredTimeSlot || "evening",
      status: "pending",
      sentiment_level: "hesitant",
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/family");
  return { success: true, leadId: data?.id };
}

export async function updateLeadStatusAction(
  leadId: string,
  status: "pending" | "in_progress" | "resolved" | "follow_up_needed",
  notes?: string
) {
  if (!leadId) {
    return { error: "Lead ID is required." };
  }

  const supabase = await createClient();

  const updatePayload: {
    status: "pending" | "in_progress" | "resolved" | "follow_up_needed";
    counsellor_notes?: string;
    updated_at: string;
  } = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (notes !== undefined) {
    updatePayload.counsellor_notes = notes;
  }

  const { error } = await supabase
    .from("family_callbacks")
    .update(updatePayload)
    .eq("id", leadId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}
