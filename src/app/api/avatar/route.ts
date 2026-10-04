import { NextRequest, NextResponse } from "next/server";

// Endpoint serving avatar 3D configuration, VRM model URL, expressions, and motion presets
export async function GET(request: NextRequest) {
  const avatarConfig = {
    modelUrl: "/avatar/saathi.vrm",
    fallbackModelUrl: "https://pixiv.github.io/three-vrm/packages/three-vrm/examples/models/VRM1_Constraint_Twist_Sample.vrm",
    defaultExpression: "neutral",
    voiceConfig: {
      provider: "sarvamai",
      model: "bulbul:v1",
      speaker: "meera",
      pace: 1.0,
      temperature: 0.6,
    },
    supportedGestures: ["nod", "wave", "thinking", "affirmative", "encourage"],
  };

  return NextResponse.json(avatarConfig);
}
