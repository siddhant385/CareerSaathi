export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          created_at: string
          details: string
          event_type: string
          id: string
          learner_id: string | null
          location: string
          student_name: string
          trade_id: string | null
        }
        Insert: {
          created_at?: string
          details: string
          event_type: string
          id?: string
          learner_id?: string | null
          location: string
          student_name: string
          trade_id?: string | null
        }
        Update: {
          created_at?: string
          details?: string
          event_type?: string
          id?: string
          learner_id?: string | null
          location?: string
          student_name?: string
          trade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admission_timelines: {
        Row: {
          academic_year: string
          date_label_en: string
          date_label_hi: string
          district: string | null
          id: string
          state: string
          status: string | null
          step_number: number
          title_en: string
          title_hi: string
        }
        Insert: {
          academic_year?: string
          date_label_en: string
          date_label_hi: string
          district?: string | null
          id?: string
          state?: string
          status?: string | null
          step_number: number
          title_en: string
          title_hi: string
        }
        Update: {
          academic_year?: string
          date_label_en?: string
          date_label_hi?: string
          district?: string | null
          id?: string
          state?: string
          status?: string | null
          step_number?: number
          title_en?: string
          title_hi?: string
        }
        Relationships: []
      }
      counselling_sessions: {
        Row: {
          audio_recording_url: string | null
          created_at: string
          detected_sentiment:
            | Database["public"]["Enums"]["sentiment_level"]
            | null
          duration_seconds: number | null
          extracted_concerns: string[] | null
          hud_widgets_shown: Json | null
          id: string
          learner_id: string
          trade_id: string | null
          transcript: Json
        }
        Insert: {
          audio_recording_url?: string | null
          created_at?: string
          detected_sentiment?:
            | Database["public"]["Enums"]["sentiment_level"]
            | null
          duration_seconds?: number | null
          extracted_concerns?: string[] | null
          hud_widgets_shown?: Json | null
          id?: string
          learner_id: string
          trade_id?: string | null
          transcript?: Json
        }
        Update: {
          audio_recording_url?: string | null
          created_at?: string
          detected_sentiment?:
            | Database["public"]["Enums"]["sentiment_level"]
            | null
          duration_seconds?: number | null
          extracted_concerns?: string[] | null
          hud_widgets_shown?: Json | null
          id?: string
          learner_id?: string
          trade_id?: string | null
          transcript?: Json
        }
        Relationships: [
          {
            foreignKeyName: "counselling_sessions_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counselling_sessions_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "vocational_trades"
            referencedColumns: ["id"]
          },
        ]
      }
      family_callbacks: {
        Row: {
          ai_transcript_snippet: string | null
          assigned_counsellor_id: string | null
          counsellor_notes: string | null
          created_at: string
          household_id: string
          id: string
          parent_phone: string
          preferred_dialect: string
          preferred_time_slot: string | null
          primary_resistance: string
          scheduled_iti_visit_date: string | null
          sentiment_level: Database["public"]["Enums"]["sentiment_level"] | null
          status: Database["public"]["Enums"]["callback_status"] | null
          target_trade_id: string
          updated_at: string
        }
        Insert: {
          ai_transcript_snippet?: string | null
          assigned_counsellor_id?: string | null
          counsellor_notes?: string | null
          created_at?: string
          household_id: string
          id?: string
          parent_phone: string
          preferred_dialect: string
          preferred_time_slot?: string | null
          primary_resistance: string
          scheduled_iti_visit_date?: string | null
          sentiment_level?:
            | Database["public"]["Enums"]["sentiment_level"]
            | null
          status?: Database["public"]["Enums"]["callback_status"] | null
          target_trade_id: string
          updated_at?: string
        }
        Update: {
          ai_transcript_snippet?: string | null
          assigned_counsellor_id?: string | null
          counsellor_notes?: string | null
          created_at?: string
          household_id?: string
          id?: string
          parent_phone?: string
          preferred_dialect?: string
          preferred_time_slot?: string | null
          primary_resistance?: string
          scheduled_iti_visit_date?: string | null
          sentiment_level?:
            | Database["public"]["Enums"]["sentiment_level"]
            | null
          status?: Database["public"]["Enums"]["callback_status"] | null
          target_trade_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_callbacks_assigned_counsellor_id_fkey"
            columns: ["assigned_counsellor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_callbacks_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_callbacks_target_trade_id_fkey"
            columns: ["target_trade_id"]
            isOneToOne: false
            referencedRelation: "vocational_trades"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string
          family_share_token: string
          id: string
          last_parent_viewed_at: string | null
          learner_id: string
          parent_consent_recorded: boolean | null
          parent_name: string | null
          parent_phone: string | null
          parent_relation: string | null
          preferred_dialect: string | null
        }
        Insert: {
          created_at?: string
          family_share_token: string
          id?: string
          last_parent_viewed_at?: string | null
          learner_id: string
          parent_consent_recorded?: boolean | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_relation?: string | null
          preferred_dialect?: string | null
        }
        Update: {
          created_at?: string
          family_share_token?: string
          id?: string
          last_parent_viewed_at?: string | null
          learner_id?: string
          parent_consent_recorded?: boolean | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_relation?: string | null
          preferred_dialect?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "households_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          audio_narration_enabled: boolean | null
          created_at: string
          dbt_eligible: boolean | null
          degree_detail: string | null
          district: string | null
          full_name: string
          goal: string | null
          highest_qualification:
            | Database["public"]["Enums"]["qualification_level"]
            | null
          id: string
          interests: string[] | null
          phone: string | null
          pin_code: string | null
          preferred_language: string | null
          registered_portals: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          shortlisted_trade_ids: string[] | null
          spoken_dialects: string[] | null
          state: string | null
          updated_at: string
          work_preference: string | null
        }
        Insert: {
          audio_narration_enabled?: boolean | null
          created_at?: string
          dbt_eligible?: boolean | null
          degree_detail?: string | null
          district?: string | null
          full_name?: string
          goal?: string | null
          highest_qualification?:
            | Database["public"]["Enums"]["qualification_level"]
            | null
          id: string
          interests?: string[] | null
          phone?: string | null
          pin_code?: string | null
          preferred_language?: string | null
          registered_portals?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          shortlisted_trade_ids?: string[] | null
          spoken_dialects?: string[] | null
          state?: string | null
          updated_at?: string
          work_preference?: string | null
        }
        Update: {
          audio_narration_enabled?: boolean | null
          created_at?: string
          dbt_eligible?: boolean | null
          degree_detail?: string | null
          district?: string | null
          full_name?: string
          goal?: string | null
          highest_qualification?:
            | Database["public"]["Enums"]["qualification_level"]
            | null
          id?: string
          interests?: string[] | null
          phone?: string | null
          pin_code?: string | null
          preferred_language?: string | null
          registered_portals?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          shortlisted_trade_ids?: string[] | null
          spoken_dialects?: string[] | null
          state?: string | null
          updated_at?: string
          work_preference?: string | null
        }
        Relationships: []
      }
      student_documents: {
        Row: {
          created_at: string
          doc_type: Database["public"]["Enums"]["doc_type_enum"]
          file_name: string | null
          id: string
          learner_id: string
          status: Database["public"]["Enums"]["doc_status_enum"] | null
          storage_path: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          doc_type: Database["public"]["Enums"]["doc_type_enum"]
          file_name?: string | null
          id?: string
          learner_id: string
          status?: Database["public"]["Enums"]["doc_status_enum"] | null
          storage_path?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          doc_type?: Database["public"]["Enums"]["doc_type_enum"]
          file_name?: string | null
          id?: string
          learner_id?: string
          status?: Database["public"]["Enums"]["doc_status_enum"] | null
          storage_path?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_documents_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_trade_selections: {
        Row: {
          id: string
          is_primary: boolean | null
          learner_id: string
          selected_at: string
          trade_id: string
        }
        Insert: {
          id?: string
          is_primary?: boolean | null
          learner_id: string
          selected_at?: string
          trade_id: string
        }
        Update: {
          id?: string
          is_primary?: boolean | null
          learner_id?: string
          selected_at?: string
          trade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_trade_selections_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_trade_selections_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "vocational_trades"
            referencedColumns: ["id"]
          },
        ]
      }
      training_centers: {
        Row: {
          address: string
          bus_route_info_en: string | null
          bus_route_info_hi: string | null
          center_type: Database["public"]["Enums"]["center_type_enum"] | null
          contact_phone: string | null
          created_at: string
          district: string
          id: string
          is_verified: boolean | null
          name: string
          placement_rate_pct: number | null
          state: string
          trade_id: string | null
          travel_distance_km: number | null
        }
        Insert: {
          address: string
          bus_route_info_en?: string | null
          bus_route_info_hi?: string | null
          center_type?: Database["public"]["Enums"]["center_type_enum"] | null
          contact_phone?: string | null
          created_at?: string
          district: string
          id?: string
          is_verified?: boolean | null
          name: string
          placement_rate_pct?: number | null
          state?: string
          trade_id?: string | null
          travel_distance_km?: number | null
        }
        Update: {
          address?: string
          bus_route_info_en?: string | null
          bus_route_info_hi?: string | null
          center_type?: Database["public"]["Enums"]["center_type_enum"] | null
          contact_phone?: string | null
          created_at?: string
          district?: string
          id?: string
          is_verified?: boolean | null
          name?: string
          placement_rate_pct?: number | null
          state?: string
          trade_id?: string | null
          travel_distance_km?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_centers_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "vocational_trades"
            referencedColumns: ["id"]
          },
        ]
      }
      vocational_trades: {
        Row: {
          category: Database["public"]["Enums"]["trade_category"]
          created_at: string
          description_en: string
          description_hi: string
          duration_months: number
          govt_annual_fee: number
          id: string
          key_skills: string[] | null
          min_qualification: Database["public"]["Enums"]["qualification_level"]
          ncvt_approved: boolean | null
          pay_growth_2yr_en: string
          pay_growth_2yr_hi: string
          private_annual_fee: number
          safety_rating_en: string
          safety_rating_hi: string
          starting_monthly_pay_max: number
          starting_monthly_pay_min: number
          title_en: string
          title_hi: string
        }
        Insert: {
          category: Database["public"]["Enums"]["trade_category"]
          created_at?: string
          description_en: string
          description_hi: string
          duration_months?: number
          govt_annual_fee?: number
          id: string
          key_skills?: string[] | null
          min_qualification?: Database["public"]["Enums"]["qualification_level"]
          ncvt_approved?: boolean | null
          pay_growth_2yr_en: string
          pay_growth_2yr_hi: string
          private_annual_fee?: number
          safety_rating_en?: string
          safety_rating_hi?: string
          starting_monthly_pay_max?: number
          starting_monthly_pay_min?: number
          title_en: string
          title_hi: string
        }
        Update: {
          category?: Database["public"]["Enums"]["trade_category"]
          created_at?: string
          description_en?: string
          description_hi?: string
          duration_months?: number
          govt_annual_fee?: number
          id?: string
          key_skills?: string[] | null
          min_qualification?: Database["public"]["Enums"]["qualification_level"]
          ncvt_approved?: boolean | null
          pay_growth_2yr_en?: string
          pay_growth_2yr_hi?: string
          private_annual_fee?: number
          safety_rating_en?: string
          safety_rating_hi?: string
          starting_monthly_pay_max?: number
          starting_monthly_pay_min?: number
          title_en?: string
          title_hi?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_learner_recommendations: {
        Args: {
          p_district?: string
          p_goal?: string
          p_interests?: string[]
          p_qualification?: Database["public"]["Enums"]["qualification_level"]
          p_user_id?: string
          p_work_pref?: string
        }
        Returns: {
          category: Database["public"]["Enums"]["trade_category"]
          description_en: string
          description_hi: string
          duration_months: number
          govt_annual_fee: number
          id: string
          is_local_district: boolean
          key_skills: string[]
          match_score: number
          nearest_bus_route_en: string
          nearest_bus_route_hi: string
          nearest_center_name: string
          nearest_distance_km: number
          pay_growth_2yr_en: string
          pay_growth_2yr_hi: string
          private_annual_fee: number
          safety_rating_en: string
          safety_rating_hi: string
          starting_monthly_pay_max: number
          starting_monthly_pay_min: number
          title_en: string
          title_hi: string
          verified_centres_count: number
          why_fit_en: string
          why_fit_hi: string
        }[]
      }
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      callback_status:
        | "pending"
        | "in_progress"
        | "resolved"
        | "follow_up_needed"
      center_type_enum: "govt_iti" | "pmkk" | "polytechnic" | "private_iti"
      doc_status_enum: "pending" | "ready" | "verified" | "rejected"
      doc_type_enum:
        | "marksheet_10th"
        | "aadhaar_card"
        | "domicile_certificate"
        | "income_certificate"
        | "bank_passbook_dbt"
        | "passport_photos"
        | "resume"
      qualification_level:
        | "class_8"
        | "class_10"
        | "class_12"
        | "iti_diploma"
        | "graduate"
        | "other"
      sentiment_level: "aligned" | "hesitant" | "conflicted" | "blocked"
      trade_category:
        | "electrical"
        | "auto"
        | "digital"
        | "healthcare"
        | "construction"
        | "craft"
      user_role: "learner" | "counsellor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
