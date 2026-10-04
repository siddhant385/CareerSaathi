export type EvidenceLevel = "verified" | "guidance" | "toConfirm";

export type DecisionStage =
  | "learning"
  | "comparing"
  | "discussing"
  | "chosen";

export interface CareerPath {
  id: string;
  title: string;
  matchScore: number;
  workStyle: string;
  duration: string;
  totalCost: string;
  startingPay: string;
  payGrowth: string;
  verifiedCentresCount: number;
  nearestCenter: string;
  travelDistance: string;
  safetyRating: string;
  dayInTheLife: string;
  whyFit: string;
  questionsAnswered: string;
  evidenceLevel: EvidenceLevel;
  keySkills: string[];
}
