export interface ParentSummaryMetric {
  id: string;
  icon: string;
  labelEn: string;
  labelHi: string;
  valueEn: string;
  valueHi: string;
  detailEn: string;
  detailHi: string;
}

export interface ParentConcern {
  id: string;
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
  icon: string;
  badgeEn?: string;
  badgeHi?: string;
}

export interface CounsellorProfile {
  id: string;
  name: string;
  titleEn: string;
  titleHi: string;
  experienceEn: string;
  experienceHi: string;
  languages: string[];
  rating: number;
  familiesGuided: number;
  availableSlotEn: string;
  availableSlotHi: string;
  phoneNumber?: string;
}
