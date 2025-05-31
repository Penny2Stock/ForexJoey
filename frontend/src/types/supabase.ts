/**
 * TypeScript definitions for Supabase database tables
 * Ensures type safety for ForexJoey's AI-first approach
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
          risk_profile: string
          account_balance: number
          max_drawdown_percentage: number
          max_position_size_percentage: number
          max_daily_trades: number
          experience_level: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          risk_profile?: string
          account_balance?: number
          max_drawdown_percentage?: number
          max_position_size_percentage?: number
          max_daily_trades?: number
          experience_level?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          risk_profile?: string
          account_balance?: number
          max_drawdown_percentage?: number
          max_position_size_percentage?: number
          max_daily_trades?: number
          experience_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      risk_management_rules: {
        Row: {
          id: string
          user_id: string
          max_loss_per_trade_percentage: number
          max_daily_loss_percentage: number
          max_weekly_loss_percentage: number
          position_sizing_method: string
          take_profit_risk_ratio: number
          auto_close_losing_trades: boolean
          correlation_limit: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          max_loss_per_trade_percentage?: number
          max_daily_loss_percentage?: number
          max_weekly_loss_percentage?: number
          position_sizing_method?: string
          take_profit_risk_ratio?: number
          auto_close_losing_trades?: boolean
          correlation_limit?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          max_loss_per_trade_percentage?: number
          max_daily_loss_percentage?: number
          max_weekly_loss_percentage?: number
          position_sizing_method?: string
          take_profit_risk_ratio?: number
          auto_close_losing_trades?: boolean
          correlation_limit?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_management_rules_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      signals: {
        Row: {
          id: string
          currency_pair: string
          direction: string
          entry_price: number | null
          stop_loss: number | null
          take_profit: number | null
          timeframe: string
          confidence_score: number
          status: string
          signal_expiry: string | null
          created_at: string
          updated_at: string
          technical_score: number | null
          fundamental_score: number | null
          sentiment_score: number | null
          economic_score: number | null
          risk_reward_ratio: number | null
          position_size_recommendation: number | null
          max_risk_amount: number | null
          ai_reasoning: string
          technical_reasoning: string | null
          fundamental_reasoning: string | null
          sentiment_reasoning: string | null
          economic_reasoning: string | null
        }
        Insert: {
          id?: string
          currency_pair: string
          direction: string
          entry_price?: number | null
          stop_loss?: number | null
          take_profit?: number | null
          timeframe: string
          confidence_score: number
          status?: string
          signal_expiry?: string | null
          created_at?: string
          updated_at?: string
          technical_score?: number | null
          fundamental_score?: number | null
          sentiment_score?: number | null
          economic_score?: number | null
          risk_reward_ratio?: number | null
          position_size_recommendation?: number | null
          max_risk_amount?: number | null
          ai_reasoning: string
          technical_reasoning?: string | null
          fundamental_reasoning?: string | null
          sentiment_reasoning?: string | null
          economic_reasoning?: string | null
        }
        Update: {
          id?: string
          currency_pair?: string
          direction?: string
          entry_price?: number | null
          stop_loss?: number | null
          take_profit?: number | null
          timeframe?: string
          confidence_score?: number
          status?: string
          signal_expiry?: string | null
          created_at?: string
          updated_at?: string
          technical_score?: number | null
          fundamental_score?: number | null
          sentiment_score?: number | null
          economic_score?: number | null
          risk_reward_ratio?: number | null
          position_size_recommendation?: number | null
          max_risk_amount?: number | null
          ai_reasoning?: string
          technical_reasoning?: string | null
          fundamental_reasoning?: string | null
          sentiment_reasoning?: string | null
          economic_reasoning?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          id: string
          user_id: string
          signal_id: string | null
          currency_pair: string
          direction: string
          entry_price: number
          stop_loss: number
          take_profit: number
          position_size: number
          status: string
          exit_price: number | null
          profit_loss: number | null
          profit_loss_percentage: number | null
          exit_reason: string | null
          entry_time: string
          exit_time: string | null
          timeframe: string
          risk_amount: number
          risk_percentage: number
          account_balance_before: number
          account_balance_after: number | null
          trailed_stop: boolean
          added_to_position: boolean
          partial_exit: boolean
        }
        Insert: {
          id?: string
          user_id: string
          signal_id?: string | null
          currency_pair: string
          direction: string
          entry_price: number
          stop_loss: number
          take_profit: number
          position_size: number
          status?: string
          exit_price?: number | null
          profit_loss?: number | null
          profit_loss_percentage?: number | null
          exit_reason?: string | null
          entry_time?: string
          exit_time?: string | null
          timeframe: string
          risk_amount: number
          risk_percentage: number
          account_balance_before: number
          account_balance_after?: number | null
          trailed_stop?: boolean
          added_to_position?: boolean
          partial_exit?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          signal_id?: string | null
          currency_pair?: string
          direction?: string
          entry_price?: number
          stop_loss?: number
          take_profit?: number
          position_size?: number
          status?: string
          exit_price?: number | null
          profit_loss?: number | null
          profit_loss_percentage?: number | null
          exit_reason?: string | null
          entry_time?: string
          exit_time?: string | null
          timeframe?: string
          risk_amount?: number
          risk_percentage?: number
          account_balance_before?: number
          account_balance_after?: number | null
          trailed_stop?: boolean
          added_to_position?: boolean
          partial_exit?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "trades_signal_id_fkey"
            columns: ["signal_id"]
            referencedRelation: "signals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      learning_journal: {
        Row: {
          id: string
          trade_id: string | null
          signal_id: string | null
          currency_pair: string
          timeframe: string
          lessons_learned: string[]
          factor_weights: Json
          adjusted_factor_weights: Json | null
          outcome_analysis: string
          accuracy_improvement: number
          created_at: string
        }
        Insert: {
          id?: string
          trade_id?: string | null
          signal_id?: string | null
          currency_pair: string
          timeframe: string
          lessons_learned: string[]
          factor_weights: Json
          adjusted_factor_weights?: Json | null
          outcome_analysis: string
          accuracy_improvement: number
          created_at?: string
        }
        Update: {
          id?: string
          trade_id?: string | null
          signal_id?: string | null
          currency_pair?: string
          timeframe?: string
          lessons_learned?: string[]
          factor_weights?: Json
          adjusted_factor_weights?: Json | null
          outcome_analysis?: string
          accuracy_improvement?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_journal_signal_id_fkey"
            columns: ["signal_id"]
            referencedRelation: "signals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_journal_trade_id_fkey"
            columns: ["trade_id"]
            referencedRelation: "trades"
            referencedColumns: ["id"]
          }
        ]
      }
      educational_content: {
        Row: {
          id: string
          title: string
          content_type: string
          category: string
          difficulty: string
          content: string
          resources: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content_type: string
          category: string
          difficulty: string
          content: string
          resources?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content_type?: string
          category?: string
          difficulty?: string
          content?: string
          resources?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          content_id: string
          completed: boolean
          score: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          completed?: boolean
          score?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          completed?: boolean
          score?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_content_id_fkey"
            columns: ["content_id"]
            referencedRelation: "educational_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_position_size: {
        Args: {
          account_balance: number
          risk_percentage: number
          entry_price: number
          stop_loss: number
          currency_pair: string
        }
        Returns: number
      }
      calculate_trade_risk: {
        Args: {
          currency_pair: string
          direction: string
          entry_price: number
          stop_loss: number
          take_profit: number
          position_size: number
          timeframe: string
        }
        Returns: Json
      }
      check_risk_compliance: {
        Args: {
          p_user_id: string
          p_currency_pair: string
          p_direction: string
          p_entry_price: number
          p_stop_loss: number
          p_take_profit: number
          p_position_size: number
          p_timeframe: string
        }
        Returns: Json
      }
      update_drawdown: {
        Args: {
          p_user_id: string
        }
        Returns: Json
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
