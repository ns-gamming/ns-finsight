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
      accounts: {
        Row: {
          account_name: string
          account_type: string
          balance: number | null
          created_at: string | null
          id: string
          metadata: Json | null
          provider: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_type: string
          balance?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          provider?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_type?: string
          balance?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          provider?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          achieved_at: string | null
          category: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          metadata: Json | null
          milestone_value: number | null
          title: string
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          metadata?: Json | null
          milestone_value?: number | null
          title: string
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          metadata?: Json | null
          milestone_value?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      anomalies: {
        Row: {
          anomaly_score: number
          created_at: string | null
          id: string
          reason: string | null
          status: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          anomaly_score: number
          created_at?: string | null
          id?: string
          reason?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          anomaly_score?: number
          created_at?: string | null
          id?: string
          reason?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anomalies_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anomalies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          location: string | null
          metadata: Json | null
          name: string
          purchase_date: string | null
          type: string
          updated_at: string | null
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          name: string
          purchase_date?: string | null
          type: string
          updated_at?: string | null
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          name?: string
          purchase_date?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      budgets: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          period: string
          start_date: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          period: string
          start_date: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          period?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          default_budget: number | null
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          default_budget?: number | null
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          default_budget?: number | null
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      connected_accounts: {
        Row: {
          account_id: string | null
          account_number: string | null
          created_at: string | null
          id: string
          last_synced: string | null
          metadata: Json | null
          provider: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          account_number?: string | null
          created_at?: string | null
          id?: string
          last_synced?: string | null
          metadata?: Json | null
          provider: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          account_number?: string | null
          created_at?: string | null
          id?: string
          last_synced?: string | null
          metadata?: Json | null
          provider?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connected_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto: {
        Row: {
          created_at: string | null
          currency: string | null
          current_price: number | null
          id: string
          name: string
          platform: string | null
          purchase_price: number
          quantity: number
          symbol: string
          updated_at: string | null
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          current_price?: number | null
          id?: string
          name: string
          platform?: string | null
          purchase_price: number
          quantity: number
          symbol: string
          updated_at?: string | null
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          current_price?: number | null
          id?: string
          name?: string
          platform?: string | null
          purchase_price?: number
          quantity?: number
          symbol?: string
          updated_at?: string | null
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      exports: {
        Row: {
          completed_at: string | null
          created_at: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          id: string
          is_alive: boolean | null
          metadata: Json | null
          name: string
          relationship: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          id?: string
          is_alive?: boolean | null
          metadata?: Json | null
          name: string
          relationship: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          id?: string
          is_alive?: boolean | null
          metadata?: Json | null
          name?: string
          relationship?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          rating: number | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          rating?: number | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          rating?: number | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          current_amount: number | null
          id: string
          metadata: Json | null
          name: string
          status: string | null
          target_amount: number
          target_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          id?: string
          metadata?: Json | null
          name: string
          status?: string | null
          target_amount: number
          target_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          id?: string
          metadata?: Json | null
          name?: string
          status?: string | null
          target_amount?: number
          target_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          amount: number
          created_at: string | null
          current_value: number | null
          id: string
          metadata: Json | null
          name: string
          purchase_date: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          current_value?: number | null
          id?: string
          metadata?: Json | null
          name: string
          purchase_date: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          current_value?: number | null
          id?: string
          metadata?: Json | null
          name?: string
          purchase_date?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_hash: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          currency: string | null
          delivery_date: string | null
          id: string
          item_name: string
          merchant: string | null
          metadata: Json | null
          notes: string | null
          order_date: string
          status: string | null
          tracking_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          currency?: string | null
          delivery_date?: string | null
          id?: string
          item_name: string
          merchant?: string | null
          metadata?: Json | null
          notes?: string | null
          order_date?: string
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          currency?: string | null
          delivery_date?: string | null
          id?: string
          item_name?: string
          merchant?: string | null
          metadata?: Json | null
          notes?: string | null
          order_date?: string
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      precious_metals: {
        Row: {
          created_at: string | null
          currency: string | null
          current_price: number | null
          id: string
          metadata: Json | null
          metal_type: string
          provider: string | null
          purchase_date: string
          purchase_price: number
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          current_price?: number | null
          id?: string
          metadata?: Json | null
          metal_type: string
          provider?: string | null
          purchase_date: string
          purchase_price: number
          quantity: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          current_price?: number | null
          id?: string
          metadata?: Json | null
          metal_type?: string
          provider?: string | null
          purchase_date?: string
          purchase_price?: number
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stocks: {
        Row: {
          created_at: string | null
          currency: string | null
          current_price: number | null
          exchange: string | null
          id: string
          name: string
          purchase_price: number
          quantity: number
          symbol: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          current_price?: number | null
          exchange?: string | null
          id?: string
          name: string
          purchase_price: number
          quantity: number
          symbol: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          current_price?: number | null
          exchange?: string | null
          id?: string
          name?: string
          purchase_price?: number
          quantity?: number
          symbol?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          category_id: string | null
          created_at: string | null
          currency: string
          family_member_id: string | null
          id: string
          ip_hash: string | null
          merchant: string | null
          metadata: Json | null
          notes: string | null
          receipt_url: string | null
          tags: string[] | null
          timestamp: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category_id?: string | null
          created_at?: string | null
          currency?: string
          family_member_id?: string | null
          id?: string
          ip_hash?: string | null
          merchant?: string | null
          metadata?: Json | null
          notes?: string | null
          receipt_url?: string | null
          tags?: string[] | null
          timestamp?: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category_id?: string | null
          created_at?: string | null
          currency?: string
          family_member_id?: string | null
          id?: string
          ip_hash?: string | null
          merchant?: string | null
          metadata?: Json | null
          notes?: string | null
          receipt_url?: string | null
          tags?: string[] | null
          timestamp?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          age: number | null
          created_at: string | null
          currency: string | null
          date_of_birth: string | null
          display_name: string | null
          email: string
          gender: string | null
          id: string
          preferences: Json | null
          profile_picture_url: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          currency?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          email: string
          gender?: string | null
          id: string
          preferences?: Json | null
          profile_picture_url?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          currency?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          email?: string
          gender?: string | null
          id?: string
          preferences?: Json | null
          profile_picture_url?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
