import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://frmnaifkkepkmsukpjes.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybW5haWZra2Vwa21zdWtwamVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE5MzgyMzgsImV4cCI6MjAzNzUxNDIzOH0.w-gLMQ-y8EWE8jbESsZAIRpTuHF95Yq8y2_UkCrFwvw';

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Risk management functions
export const riskManagement = {
  /**
   * Analyze trade risk to ensure compliance with risk management rules
   * Aligns with ForexJoey's capital protection principle
   */
  assessTradeRisk: async (tradeData: {
    currency_pair: string;
    direction: string;
    entry_price: number;
    stop_loss: number;
    take_profit: number;
    position_size: number;
    timeframe: string;
  }) => {
    try {
      // Call the risk-management edge function
      const { data, error } = await supabase.functions.invoke('risk-management', {
        body: JSON.stringify(tradeData),
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error assessing trade risk:', error);
      throw error;
    }
  },
  
  /**
   * Get user's risk profile and settings
   */
  getUserRiskProfile: async () => {
    try {
      const { data: user, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error: profileError } = await supabase
        .from('users')
        .select(`
          risk_profile,
          max_drawdown_percentage,
          max_position_size_percentage,
          max_daily_trades,
          experience_level,
          risk_management_rules (*)
        `)
        .eq('id', user.user.id)
        .single();
      
      if (profileError) throw profileError;
      return data;
    } catch (error) {
      console.error('Error fetching user risk profile:', error);
      throw error;
    }
  },
  
  /**
   * Update user's risk management settings
   */
  updateRiskSettings: async (settings: {
    risk_profile?: string;
    max_drawdown_percentage?: number;
    max_position_size_percentage?: number;
    max_daily_trades?: number;
    experience_level?: string;
    risk_rules?: {
      max_loss_per_trade_percentage?: number;
      max_daily_loss_percentage?: number;
      max_weekly_loss_percentage?: number;
      position_sizing_method?: string;
      take_profit_risk_ratio?: number;
      auto_close_losing_trades?: boolean;
    };
  }) => {
    try {
      const { data: user, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      // Update user profile
      const userUpdate = {};
      if (settings.risk_profile) userUpdate['risk_profile'] = settings.risk_profile;
      if (settings.max_drawdown_percentage) userUpdate['max_drawdown_percentage'] = settings.max_drawdown_percentage;
      if (settings.max_position_size_percentage) userUpdate['max_position_size_percentage'] = settings.max_position_size_percentage;
      if (settings.max_daily_trades) userUpdate['max_daily_trades'] = settings.max_daily_trades;
      if (settings.experience_level) userUpdate['experience_level'] = settings.experience_level;
      
      if (Object.keys(userUpdate).length > 0) {
        const { error: updateError } = await supabase
          .from('users')
          .update(userUpdate)
          .eq('id', user.user.id);
        
        if (updateError) throw updateError;
      }
      
      // Update risk rules if provided
      if (settings.risk_rules) {
        const { error: rulesError } = await supabase
          .from('risk_management_rules')
          .update(settings.risk_rules)
          .eq('user_id', user.user.id);
        
        if (rulesError) throw rulesError;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating risk settings:', error);
      throw error;
    }
  }
};

// Signal generation and management
export const signals = {
  /**
   * Get signals with multi-source intelligence breakdown
   * ForexJoey requires 2+ intelligence sources for all signals
   */
  getSignals: async (params?: {
    currency_pair?: string;
    timeframe?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      let query = supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (params?.currency_pair) {
        query = query.eq('currency_pair', params.currency_pair);
      }
      
      if (params?.timeframe) {
        query = query.eq('timeframe', params.timeframe);
      }
      
      if (params?.limit) {
        query = query.limit(params.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching signals:', error);
      throw error;
    }
  },
  
  /**
   * Get detailed signal by ID with all intelligence sources
   */
  getSignalById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching signal ${id}:`, error);
      throw error;
    }
  }
};

// User account management
export const auth = {
  /**
   * Sign up with email and password
   */
  signUp: async (email: string, password: string, userData: {
    full_name: string;
    risk_profile?: string;
    experience_level?: string;
  }) => {
    try {
      // Create user in Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
          }
        }
      });
      
      if (error) throw error;
      
      // If successful and we have a user, create user profile with defaults
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            full_name: userData.full_name,
            risk_profile: userData.risk_profile || 'conservative',
            experience_level: userData.experience_level || 'beginner'
          });
          
        if (profileError) throw profileError;
        
        // Create default risk management rules
        const { error: riskRulesError } = await supabase
          .from('risk_management_rules')
          .insert({
            user_id: data.user.id,
            max_loss_per_trade_percentage: 1.0,
            max_daily_loss_percentage: 3.0,
            max_weekly_loss_percentage: 7.0,
            position_sizing_method: 'fixed_percentage',
            take_profit_risk_ratio: 1.5,
            auto_close_losing_trades: true
          });
          
        if (riskRulesError) throw riskRulesError;
      }
      
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },
  
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },
  
  /**
   * Sign out current user
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
  
  /**
   * Get current user session
   */
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  }
};

// Educational content for onboarding and risk education
export const education = {
  /**
   * Get educational content filtered by category, difficulty, etc.
   */
  getContent: async (params?: {
    category?: string;
    difficulty?: string;
    content_type?: string;
    limit?: number;
  }) => {
    try {
      let query = supabase
        .from('educational_content')
        .select('*');
      
      if (params?.category) {
        query = query.eq('category', params.category);
      }
      
      if (params?.difficulty) {
        query = query.eq('difficulty', params.difficulty);
      }
      
      if (params?.content_type) {
        query = query.eq('content_type', params.content_type);
      }
      
      if (params?.limit) {
        query = query.limit(params.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching educational content:', error);
      throw error;
    }
  },
  
  /**
   * Get user's progress on educational content
   */
  getUserProgress: async () => {
    try {
      const { data: user, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error: progressError } = await supabase
        .from('user_progress')
        .select(`
          *,
          educational_content (
            title,
            content_type,
            category,
            difficulty
          )
        `)
        .eq('user_id', user.user.id);
      
      if (progressError) throw progressError;
      return data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  },
  
  /**
   * Update user's progress on educational content
   */
  updateProgress: async (contentId: string, data: {
    completed?: boolean;
    score?: number;
    notes?: string;
  }) => {
    try {
      const { data: user, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      const { data: existingProgress, error: checkError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('content_id', contentId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingProgress) {
        // Update existing progress
        const { error: updateError } = await supabase
          .from('user_progress')
          .update(data)
          .eq('id', existingProgress.id);
        
        if (updateError) throw updateError;
      } else {
        // Create new progress record
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.user.id,
            content_id: contentId,
            ...data
          });
        
        if (insertError) throw insertError;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }
};

// AI reflection system for continuous improvement
export const reflection = {
  /**
   * Get AI performance metrics by currency pair and timeframe
   */
  getPerformanceMetrics: async (params?: {
    currency_pair?: string;
    timeframe?: string;
  }) => {
    try {
      // First, get completed trades
      let tradesQuery = supabase
        .from('trades')
        .select('*')
        .eq('status', 'closed');
        
      if (params?.currency_pair) {
        tradesQuery = tradesQuery.eq('currency_pair', params.currency_pair);
      }
      
      if (params?.timeframe) {
        tradesQuery = tradesQuery.eq('timeframe', params.timeframe);
      }
      
      const { data: trades, error: tradesError } = await tradesQuery;
      
      if (tradesError) throw tradesError;
      
      // Get learning journal entries for analysis
      let journalQuery = supabase
        .from('learning_journal')
        .select('*');
        
      if (params?.currency_pair) {
        journalQuery = journalQuery.eq('currency_pair', params.currency_pair);
      }
      
      if (params?.timeframe) {
        journalQuery = journalQuery.eq('timeframe', params.timeframe);
      }
      
      const { data: journalEntries, error: journalError } = await journalQuery;
      
      if (journalError) throw journalError;
      
      // Process and return metrics
      return {
        trades: trades,
        journal: journalEntries,
        // Calculate performance metrics
        metrics: calculatePerformanceMetrics(trades, journalEntries)
      };
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }
};

// Helper function to calculate performance metrics
function calculatePerformanceMetrics(trades: any[], journalEntries: any[]) {
  // This would be a more complex calculation in production
  // For now, return basic metrics
  
  if (!trades.length) {
    return {
      total_trades: 0,
      win_rate: 0,
      profit_factor: 0,
      average_win: 0,
      average_loss: 0,
      largest_win: 0,
      largest_loss: 0,
      factor_weights: {
        technical: 0.5,
        fundamental: 0.2,
        sentiment: 0.2,
        economic: 0.1
      }
    };
  }
  
  const winningTrades = trades.filter(t => t.profit_loss > 0);
  const losingTrades = trades.filter(t => t.profit_loss < 0);
  
  const totalWins = winningTrades.reduce((sum, t) => sum + t.profit_loss, 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit_loss, 0));
  
  // Get latest factor weights from journal if available
  const latestJournal = journalEntries.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
  
  const factorWeights = latestJournal?.adjusted_factor_weights || {
    technical: 0.5,
    fundamental: 0.2,
    sentiment: 0.2,
    economic: 0.1
  };
  
  return {
    total_trades: trades.length,
    win_rate: winningTrades.length / trades.length,
    profit_factor: totalLosses ? totalWins / totalLosses : totalWins ? Infinity : 0,
    average_win: winningTrades.length ? totalWins / winningTrades.length : 0,
    average_loss: losingTrades.length ? totalLosses / losingTrades.length : 0,
    largest_win: winningTrades.length ? Math.max(...winningTrades.map(t => t.profit_loss)) : 0,
    largest_loss: losingTrades.length ? Math.abs(Math.min(...losingTrades.map(t => t.profit_loss))) : 0,
    factor_weights: factorWeights
  };
}
