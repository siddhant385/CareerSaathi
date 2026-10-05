"use server";

import { createClient } from "@/lib/supabase/server";

export async function getVocationalTradesAction() {
  const supabase = await createClient();

  const { data: trades, error } = await supabase
    .from("vocational_trades")
    .select(`
      *,
      training_centers (
        id,
        name,
        travel_distance_km,
        bus_route_info_en,
        bus_route_info_hi
      )
    `)
    .order("starting_monthly_pay_max", { ascending: false });

  if (error) {
    return { error: error.message, trades: [] };
  }

  return { trades: trades || [] };
}

export async function getAdmissionTimelinesAction(state = "Bihar") {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admission_timelines")
    .select("*")
    .eq("state", state)
    .order("step_number", { ascending: true });

  if (error) {
    return { error: error.message, timelines: [] };
  }

  return { timelines: data || [] };
}

export async function getAdminLeadsAction() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("family_callbacks")
    .select(`
      *,
      households (
        parent_name,
        parent_relation,
        parent_phone
      ),
      vocational_trades (
        title_en,
        title_hi,
        govt_annual_fee
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, leads: [] };
  }

  return { leads: data || [] };
}
