export type SentimentLevel = "aligned" | "hesitant" | "conflicted" | "blocked";

export interface FamilyCallbackLead {
  id: string;
  studentName: string;
  parentName: string;
  relation: "father" | "mother" | "guardian";
  phone: string;
  preferredDialect: string;
  location: string;
  targetTrade: string;
  govtFee: string;
  sentimentLevel: SentimentLevel;
  primaryResistance: string;
  aiTranscriptSnippet: string;
  requestedAt: string;
  status: "pending" | "in_progress" | "resolved" | "follow_up_needed";
  counsellorNotes?: string;
  assignedCounsellor?: string;
  isRealtime?: boolean;
}

export interface TradeEditorItem {
  id: string;
  title: string;
  category: string;
  govtFee: string;
  startingPay: string;
  payGrowth: string;
  nearestCenter: string;
  placementRate: string;
  safetyStatus: string;
  eligibility: string;
}

export interface SentimentOverviewMetric {
  title: string;
  value: string;
  change: string;
  detail: string;
  trend: "up" | "neutral" | "down";
}
