import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles counsellor queue leads & family callback scheduling requests
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    // Query callbacks joined with trade and household details
    const { data: callbacks, error } = await supabase
      .from("family_callbacks")
      .select(`
        id,
        parent_phone,
        preferred_time_slot,
        preferred_dialect,
        sentiment_level,
        primary_resistance,
        ai_transcript_snippet,
        status,
        scheduled_iti_visit_date,
        created_at,
        vocational_trades (
          id,
          title_en,
          title_hi
        ),
        households (
          id,
          parent_name,
          learner_id,
          profiles (
            full_name,
            district,
            state
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      leads: callbacks || [],
      status: "healthy",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch leads";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      householdId,
      targetTradeId,
      parentPhone,
      preferredDialect = "Hindi",
      preferredTimeSlot = "evening",
      sentimentLevel = "hesitant",
      primaryResistance = "General counselling query",
      aiTranscriptSnippet,
    } = body;

    if (!parentPhone || !targetTradeId) {
      return NextResponse.json(
        { error: "parentPhone and targetTradeId are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // If householdId not passed, retrieve or create household for logged-in user
    let finalHouseholdId = householdId;
    if (!finalHouseholdId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: household } = await supabase
          .from("households")
          .select("id")
          .eq("learner_id", user.id)
          .maybeSingle();

        finalHouseholdId = household?.id;
      }
    }

    if (!finalHouseholdId) {
      return NextResponse.json(
        { error: "A valid householdId or authenticated learner session is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("family_callbacks")
      .insert({
        household_id: finalHouseholdId,
        target_trade_id: targetTradeId,
        parent_phone: parentPhone,
        preferred_dialect: preferredDialect,
        preferred_time_slot: preferredTimeSlot,
        sentiment_level: sentimentLevel,
        primary_resistance: primaryResistance,
        ai_transcript_snippet: aiTranscriptSnippet || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      lead: data,
      message: "Callback scheduled successfully with dialect-matched counsellor.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to record callback";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
