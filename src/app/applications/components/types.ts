export interface DocumentItem {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  required: boolean;
  status: "ready" | "pending" | "optional";
  exampleEn: string;
  exampleHi: string;
}

export interface AdmissionStep {
  stepNumber: number;
  titleEn: string;
  titleHi: string;
  dateEn: string;
  dateHi: string;
  status: "active" | "upcoming" | "completed";
  actionTextEn: string;
  actionTextHi: string;
}
