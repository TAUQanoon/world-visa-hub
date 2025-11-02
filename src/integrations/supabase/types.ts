export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      builder_io_webhooks: {
        Row: {
          created_at: string
          created_case_id: string | null
          form_id: string
          id: string
          processed: boolean | null
          submission_data: Json
        }
        Insert: {
          created_at?: string
          created_case_id?: string | null
          form_id: string
          id?: string
          processed?: boolean | null
          submission_data?: Json
        }
        Update: {
          created_at?: string
          created_case_id?: string | null
          form_id?: string
          id?: string
          processed?: boolean | null
          submission_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "builder_io_webhooks_created_case_id_fkey"
            columns: ["created_case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_timeline: {
        Row: {
          case_id: string
          created_at: string
          id: string
          notes: string | null
          stage: string | null
          status: string | null
          updated_by: string
        }
        Insert: {
          case_id: string
          created_at?: string
          id?: string
          notes?: string | null
          stage?: string | null
          status?: string | null
          updated_by: string
        }
        Update: {
          case_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          stage?: string | null
          status?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_timeline_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_timeline_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          assigned_staff_id: string | null
          case_number: string
          client_id: string
          created_at: string
          current_stage: string | null
          deadline: string | null
          id: string
          priority: string | null
          status: string
          updated_at: string
          visa_type_id: string
        }
        Insert: {
          assigned_staff_id?: string | null
          case_number: string
          client_id: string
          created_at?: string
          current_stage?: string | null
          deadline?: string | null
          id?: string
          priority?: string | null
          status?: string
          updated_at?: string
          visa_type_id: string
        }
        Update: {
          assigned_staff_id?: string | null
          case_number?: string
          client_id?: string
          created_at?: string
          current_stage?: string | null
          deadline?: string | null
          id?: string
          priority?: string | null
          status?: string
          updated_at?: string
          visa_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_visa_type_id_fkey"
            columns: ["visa_type_id"]
            isOneToOne: false
            referencedRelation: "visa_types"
            referencedColumns: ["id"]
          },
        ]
      }
      client_education: {
        Row: {
          city: string | null
          client_id: string
          country: string
          created_at: string | null
          degree_level: string | null
          end_date: string | null
          field_of_study: string | null
          gpa_or_grade: string | null
          id: string
          institution_name: string
          is_current: boolean | null
          start_date: string
        }
        Insert: {
          city?: string | null
          client_id: string
          country: string
          created_at?: string | null
          degree_level?: string | null
          end_date?: string | null
          field_of_study?: string | null
          gpa_or_grade?: string | null
          id?: string
          institution_name: string
          is_current?: boolean | null
          start_date: string
        }
        Update: {
          city?: string | null
          client_id?: string
          country?: string
          created_at?: string | null
          degree_level?: string | null
          end_date?: string | null
          field_of_study?: string | null
          gpa_or_grade?: string | null
          id?: string
          institution_name?: string
          is_current?: boolean | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_education_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_employment: {
        Row: {
          city: string | null
          client_id: string
          country: string
          created_at: string | null
          employer_name: string
          end_date: string | null
          id: string
          industry: string | null
          is_current: boolean | null
          job_description: string | null
          job_title: string
          start_date: string
        }
        Insert: {
          city?: string | null
          client_id: string
          country: string
          created_at?: string | null
          employer_name: string
          end_date?: string | null
          id?: string
          industry?: string | null
          is_current?: boolean | null
          job_description?: string | null
          job_title: string
          start_date: string
        }
        Update: {
          city?: string | null
          client_id?: string
          country?: string
          created_at?: string | null
          employer_name?: string
          end_date?: string | null
          id?: string
          industry?: string | null
          is_current?: boolean | null
          job_description?: string | null
          job_title?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_employment_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_family_members: {
        Row: {
          client_id: string
          created_at: string | null
          date_of_birth: string
          full_name: string
          id: string
          is_accompanying: boolean | null
          nationality: string | null
          passport_number: string | null
          relationship: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          date_of_birth: string
          full_name: string
          id?: string
          is_accompanying?: boolean | null
          nationality?: string | null
          passport_number?: string | null
          relationship?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          date_of_birth?: string
          full_name?: string
          id?: string
          is_accompanying?: boolean | null
          nationality?: string | null
          passport_number?: string | null
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_family_members_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_languages: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          language: string
          proficiency_level: string | null
          test_date: string | null
          test_name: string | null
          test_score: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          language: string
          proficiency_level?: string | null
          test_date?: string | null
          test_name?: string | null
          test_score?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          language?: string
          proficiency_level?: string | null
          test_date?: string | null
          test_name?: string | null
          test_score?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_languages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          gender: string | null
          id: string
          marital_status: string | null
          nationality: string | null
          passport_expiry_date: string | null
          passport_issue_date: string | null
          passport_issuing_country: string | null
          passport_number: string | null
          place_of_birth: string | null
          postal_code: string | null
          state_province: string | null
          updated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          gender?: string | null
          id: string
          marital_status?: string | null
          nationality?: string | null
          passport_expiry_date?: string | null
          passport_issue_date?: string | null
          passport_issuing_country?: string | null
          passport_number?: string | null
          place_of_birth?: string | null
          postal_code?: string | null
          state_province?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          gender?: string | null
          id?: string
          marital_status?: string | null
          nationality?: string | null
          passport_expiry_date?: string | null
          passport_issue_date?: string | null
          passport_issuing_country?: string | null
          passport_number?: string | null
          place_of_birth?: string | null
          postal_code?: string | null
          state_province?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_travel_history: {
        Row: {
          client_id: string
          country: string
          created_at: string | null
          entry_date: string
          exit_date: string
          id: string
          notes: string | null
          purpose: string | null
          visa_type: string | null
        }
        Insert: {
          client_id: string
          country: string
          created_at?: string | null
          entry_date: string
          exit_date: string
          id?: string
          notes?: string | null
          purpose?: string | null
          visa_type?: string | null
        }
        Update: {
          client_id?: string
          country?: string
          created_at?: string | null
          entry_date?: string
          exit_date?: string
          id?: string
          notes?: string | null
          purpose?: string | null
          visa_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_travel_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_requests: {
        Row: {
          assigned_to: string | null
          country_of_interest: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string | null
          status: string | null
          visa_type_interest: string | null
        }
        Insert: {
          assigned_to?: string | null
          country_of_interest?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone?: string | null
          status?: string | null
          visa_type_interest?: string | null
        }
        Update: {
          assigned_to?: string | null
          country_of_interest?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string | null
          status?: string | null
          visa_type_interest?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          case_id: string
          document_category: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          name: string
          status: string | null
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          case_id: string
          document_category?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name: string
          status?: string | null
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          case_id?: string
          document_category?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name?: string
          status?: string | null
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          case_id: string
          data: Json
          form_template_id: string
          id: string
          submitted_at: string
          submitted_by: string
        }
        Insert: {
          case_id: string
          data?: Json
          form_template_id: string
          id?: string
          submitted_at?: string
          submitted_by: string
        }
        Update: {
          case_id?: string
          data?: Json
          form_template_id?: string
          id?: string
          submitted_at?: string
          submitted_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "form_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_templates: {
        Row: {
          created_at: string
          fields: Json
          id: string
          is_active: boolean | null
          name: string
          visa_type_id: string | null
        }
        Insert: {
          created_at?: string
          fields?: Json
          id?: string
          is_active?: boolean | null
          name: string
          visa_type_id?: string | null
        }
        Update: {
          created_at?: string
          fields?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          visa_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_templates_visa_type_id_fkey"
            columns: ["visa_type_id"]
            isOneToOne: false
            referencedRelation: "visa_types"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          case_id: string
          created_at: string
          id: string
          is_internal: boolean | null
          message: string
          read_at: string | null
          recipient_id: string | null
          sender_id: string
        }
        Insert: {
          case_id: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          message: string
          read_at?: string | null
          recipient_id?: string | null
          sender_id: string
        }
        Update: {
          case_id?: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          message?: string
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          case_id: string
          created_at: string
          currency: string | null
          description: string | null
          id: string
          paid_at: string | null
          status: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          case_id: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          paid_at?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          case_id?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          paid_at?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      visa_types: {
        Row: {
          category: string
          country: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          processing_time_estimate: string | null
          requirements: Json | null
          updated_at: string
          workflow_stages: Json | null
        }
        Insert: {
          category: string
          country: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          processing_time_estimate?: string | null
          requirements?: Json | null
          updated_at?: string
          workflow_stages?: Json | null
        }
        Update: {
          category?: string
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          processing_time_estimate?: string | null
          requirements?: Json | null
          updated_at?: string
          workflow_stages?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_case_number: { Args: never; Returns: string }
      has_role: {
        Args: { role_name: string; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
