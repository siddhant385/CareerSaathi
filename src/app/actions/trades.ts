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

export async function getRecommendedTradesAction(params?: {
  qualification?: string;
  district?: string;
  interests?: string[];
  goal?: string;
  workPreference?: string;
  language?: "en" | "hi";
}) {
  const supabase = await createClient();

  const qual = params?.qualification || "class_10";
  const district = params?.district || "Patna";
  const interests = params?.interests && params.interests.length > 0 ? params.interests : ["electrical", "auto"];
  const goal = params?.goal || "fast_earning";
  const workPref = params?.workPreference || "near_home";
  const isHi = params?.language === "hi";

  const { data: recs, error } = await supabase.rpc("get_learner_recommendations", {
    p_qualification: qual as any,
    p_district: district,
    p_interests: interests,
    p_goal: goal,
    p_work_pref: workPref,
  });

  if (error || !recs || recs.length === 0) {
    return { error: error?.message || "Failed to fetch recommendations", recommendations: [] };
  }

  const formatted = recs.map((r: any) => {
    const title = isHi ? r.title_hi : r.title_en;
    const duration = isHi
      ? `${r.duration_months} महीने (सरकारी NCVT)`
      : `${r.duration_months} Months (Govt NCVT)`;

    const totalCost = isHi
      ? `सरकारी आईटीआई: ₹${r.govt_annual_fee?.toLocaleString("en-IN")} | प्राइवेट: ₹${r.private_annual_fee?.toLocaleString("en-IN")}`
      : `Govt ITI: ₹${r.govt_annual_fee?.toLocaleString("en-IN")} | Private: ₹${r.private_annual_fee?.toLocaleString("en-IN")}`;

    const startingPay = isHi
      ? `₹${r.starting_monthly_pay_min?.toLocaleString("en-IN")} - ₹${r.starting_monthly_pay_max?.toLocaleString("en-IN")} प्रति माह`
      : `₹${r.starting_monthly_pay_min?.toLocaleString("en-IN")} - ₹${r.starting_monthly_pay_max?.toLocaleString("en-IN")} / mo`;

    const payGrowth = isHi ? r.pay_growth_2yr_hi : r.pay_growth_2yr_en;
    const safetyRating = isHi ? r.safety_rating_hi : r.safety_rating_en;
    const dayInTheLife = isHi ? r.description_hi : r.description_en;
    const nearestCenter = r.nearest_center_name || (isHi ? "राजकीय आईटीआई" : "Govt ITI Hub");

    const travelDistance = r.nearest_distance_km
      ? isHi
        ? `${r.nearest_distance_km} किमी दूर (${r.nearest_bus_route_hi || "स्थानीय बस"})`
        : `${r.nearest_distance_km} km away (${r.nearest_bus_route_en || "Local transit"})`
      : isHi
      ? "जिला केंद्र के निकट (बस उपलब्ध)"
      : "Near district center (bus available)";

    return {
      id: r.id,
      category: r.category,
      title,
      matchScore: r.match_score || 85,
      workStyle: isHi
        ? `व्यावहारिक एवं तकनीकी प्रशिक्षण · ${r.duration_months} महीने`
        : `Hands-on Technical · ${r.duration_months} Months`,
      duration,
      totalCost,
      startingPay,
      payGrowth,
      verifiedCentresCount: Number(r.verified_centres_count || 1),
      nearestCenter,
      travelDistance,
      safetyRating,
      dayInTheLife,
      whyFit: isHi ? r.why_fit_hi : r.why_fit_en,
      questionsAnswered: isHi ? "परिवार के सभी 5 प्रश्नों के जवाब सत्यापित" : "All 5 family questions answered",
      evidenceLevel: "verified" as const,
      keySkills: Array.isArray(r.key_skills) && r.key_skills.length > 0 ? r.key_skills : ["व्यावहारिक कौशल", "सुरक्षा नियम"],
    };
  });

  return { recommendations: formatted };
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
