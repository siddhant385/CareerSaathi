export type WidgetType =
  | "trade_spotlight"
  | "nearby_center"
  | "parent_summary"
  | "counsellor_escalation";

export interface GenerativeWidgetData {
  id: string;
  type: WidgetType;
  title: string;
  subtitle?: string;
  badge?: string;
  metrics: { label: string; value: string; icon?: string }[];
  actionText?: string;
  actionHref?: string;
  verified?: boolean;
}

export interface DialogueMessage {
  id: string;
  speaker: "saathi" | "user";
  textEn: string;
  textHi: string;
  widget?: GenerativeWidgetData;
}
