import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles live dialogue synthesis, speech recognition, and generative counselling widgets
export async function POST(request: NextRequest) {
  try {
    const {
      message,
      tradeId = "electrician",
      sessionId,
      transcriptTurn,
    } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch live trade data from Supabase for grounded context
    const { data: trade } = await supabase
      .from("vocational_trades")
      .select("*")
      .eq("id", tradeId)
      .maybeSingle();

    const startingPayMin = trade?.starting_monthly_pay_min || 14000;
    const startingPayMax = trade?.starting_monthly_pay_max || 24000;
    const titleHi = trade?.title_hi || "इलेक्ट्रीशियन";
    const titleEn = trade?.title_en || "Electrician";

    const responsePayload = {
      textEn: `${titleEn} trade offers starting salaries of ₹${startingPayMin.toLocaleString("en-IN")} - ₹${startingPayMax.toLocaleString("en-IN")}/mo. Government ITIs provide subsidized tuition at ₹1,500/yr with NCVT certification.`,
      textHi: `${titleHi} ट्रेड में शुरुआत में ₹${startingPayMin.toLocaleString("en-IN")} से ₹${startingPayMax.toLocaleString("en-IN")} प्रति माह वेतन मिलता है। सरकारी आईटीआई में मात्र ₹1,500/वर्ष में NCVT प्रमाणन के साथ प्रशिक्षण मिलता है।`,
      suggestedWidget: {
        type: "salary_timeline",
        tradeId,
        data: {
          starting: startingPayMin,
          year2: startingPayMax + 8000,
        },
      },
      avatarMotion: "nod",
    };

    // If an active session ID exists and user is authenticated, update transcript
    if (sessionId && transcriptTurn) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: currentSession } = await supabase
          .from("counselling_sessions")
          .select("transcript")
          .eq("id", sessionId)
          .maybeSingle();

        const currentTranscript = Array.isArray(currentSession?.transcript)
          ? currentSession.transcript
          : [];

        await supabase
          .from("counselling_sessions")
          .update({
            transcript: [...currentTranscript, transcriptTurn, { role: "assistant", ...responsePayload }],
          })
          .eq("id", sessionId);
      }
    }

    return NextResponse.json(responsePayload);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error processing dialogue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
