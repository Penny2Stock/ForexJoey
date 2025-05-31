'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/services/supabase';
import { Database } from '@/types/supabase';

// Types
type EducationalContent = Database['public']['Tables']['educational_content']['Row'];
type UserProgress = Database['public']['Tables']['user_progress']['Row'];

// Step IDs and titles
const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome to ForexJoey' },
  { id: 'risk-management', title: 'Risk Management' },
  { id: 'multi-source', title: 'Multi-Source Intelligence' },
  { id: 'account-setup', title: 'Account Setup' },
  { id: 'complete', title: 'Ready to Trade' }
];

/**
 * OnboardingFlow Component
 * 
 * Provides a step-by-step educational onboarding experience for new ForexJoey users.
 * Covers risk management principles, multi-source intelligence, and account setup.
 */
const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [educationalContent, setEducationalContent] = useState<EducationalContent[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [accountSetup, setAccountSetup] = useState({
    accountBalance: 10000,
    maxRiskPerTrade: 2,
    maxDailyLoss: 5,
    experienceLevel: 'beginner'
  });
  
  // Get current user and fetch educational content
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        setUserId(user.id);
        
        // Fetch educational content for onboarding
        const { data: content, error: contentError } = await supabase
          .from('educational_content')
          .select('*')
          .in('category', ['onboarding', 'risk-management'])
          .order('difficulty', { ascending: true });
          
        if (contentError) {
          throw contentError;
        }
        
        if (content) {
          setEducationalContent(content);
        }
        
        // Check user progress
        const { data: progress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);
          
        if (progressError) {
          throw progressError;
        }
        
        if (progress) {
          setUserProgress(progress);
          
          // If user has completed onboarding content, skip to final step
          const completedOnboarding = progress.some(p => 
            p.content_id === 'onboarding-complete' && p.completed
          );
          
          if (completedOnboarding) {
            setCurrentStep(ONBOARDING_STEPS.length - 1);
          }
        }
        
      } catch (err) {
        console.error('Error fetching onboarding data:', err);
        setError('Failed to load onboarding content');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Save user progress for current step
  const saveProgress = async (completed: boolean = true, score?: number) => {
    if (!userId) return;
    
    try {
      const stepId = ONBOARDING_STEPS[currentStep].id;
      const contentId = `onboarding-${stepId}`;
      
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          content_id: contentId,
          completed,
          score,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,content_id'
        });
        
      if (error) {
        throw error;
      }
      
      // Refresh user progress
      const { data: updatedProgress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);
        
      if (progressError) {
        throw progressError;
      }
      
      if (updatedProgress) {
        setUserProgress(updatedProgress);
      }
      
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };
  
  // Save account settings to user profile
  const saveAccountSettings = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          account_balance: accountSetup.accountBalance,
          max_position_size_percentage: accountSetup.maxRiskPerTrade,
          max_drawdown_percentage: accountSetup.maxDailyLoss,
          experience_level: accountSetup.experienceLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      // Create default risk management rules
      const { error: riskError } = await supabase
        .from('risk_management_rules')
        .upsert({
          user_id: userId,
          max_loss_per_trade_percentage: accountSetup.maxRiskPerTrade,
          max_daily_loss_percentage: accountSetup.maxDailyLoss,
          max_weekly_loss_percentage: accountSetup.maxDailyLoss * 3,
          position_sizing_method: 'percentage',
          take_profit_risk_ratio: 2,
          auto_close_losing_trades: true,
          correlation_limit: 0.7,
          active: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (riskError) {
        throw riskError;
      }
      
    } catch (err) {
      console.error('Error saving account settings:', err);
      setError('Failed to save account settings');
    }
  };
  
  // Handle next step
  const handleNext = async () => {
    // Save progress for current step
    await saveProgress(true);
    
    // If this is the account setup step, save settings
    if (ONBOARDING_STEPS[currentStep].id === 'account-setup') {
      await saveAccountSettings();
    }
    
    // Move to next step
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    
    // If this is the final step, mark onboarding as complete
    if (currentStep === ONBOARDING_STEPS.length - 2) {
      await saveProgress(true, 100);
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Get content for current step
  const getStepContent = () => {
    const stepId = ONBOARDING_STEPS[currentStep].id;
    
    switch (stepId) {
      case 'welcome':
        return <WelcomeStep />;
      case 'risk-management':
        return <RiskManagementStep />;
      case 'multi-source':
        return <MultiSourceStep />;
      case 'account-setup':
        return (
          <AccountSetupStep 
            accountSetup={accountSetup}
            onChange={setAccountSetup}
          />
        );
      case 'complete':
        return <CompleteStep />;
      default:
        return <div>Loading...</div>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-primary">Loading onboarding experience...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {ONBOARDING_STEPS.map((step, index) => (
            <div 
              key={step.id}
              className={`flex flex-col items-center ${
                index <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  index < currentStep 
                    ? 'bg-primary text-white' 
                    : index === currentStep 
                      ? 'bg-primary/20 border-2 border-primary text-primary' 
                      : 'bg-muted'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="text-xs hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-muted rounded-full">
          <div 
            className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / (ONBOARDING_STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Step Content */}
      <div className="bg-card rounded-lg p-6 shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">{ONBOARDING_STEPS[currentStep].title}</h2>
        
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {getStepContent()}
        </motion.div>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentStep === 0 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-secondary hover:bg-secondary/80 text-foreground'
          }`}
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={currentStep === ONBOARDING_STEPS.length - 1}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentStep === ONBOARDING_STEPS.length - 1
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 text-white'
          }`}
        >
          {currentStep === ONBOARDING_STEPS.length - 2 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

// Individual step components
const WelcomeStep: React.FC = () => (
  <div className="space-y-4">
    <p className="text-lg">
      Welcome to ForexJoey, your AI-first forex trading companion designed to provide high-accuracy
      trading signals and protect your capital.
    </p>
    
    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-2 text-accent">ForexJoey is Different</h3>
      <p>
        Unlike other trading platforms, ForexJoey uses multiple intelligence sources to validate every
        trading decision. Our AI engine never makes a prediction without at least two supporting signals.
      </p>
    </div>
    
    <div className="flex flex-col md:flex-row gap-4 mt-6">
      <div className="flex-1 bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">High-Accuracy Signals</h4>
        <p className="text-sm">
          Every signal is backed by technical, fundamental, and sentiment analysis
        </p>
      </div>
      
      <div className="flex-1 bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">Capital Protection</h4>
        <p className="text-sm">
          Built-in risk management system prevents excessive losses
        </p>
      </div>
      
      <div className="flex-1 bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">AI Learning</h4>
        <p className="text-sm">
          The system learns from each trade outcome to improve accuracy
        </p>
      </div>
    </div>
    
    <p className="mt-4">
      Let's go through a few quick steps to get you set up for success with ForexJoey.
    </p>
  </div>
);

const RiskManagementStep: React.FC = () => (
  <div className="space-y-4">
    <p>
      At ForexJoey, capital protection comes first. Our risk management system ensures
      you never risk more than you're comfortable with on any trade.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">Position Sizing</h4>
        <p className="text-sm mb-2">
          ForexJoey automatically calculates the optimal position size based on:
        </p>
        <ul className="list-disc pl-5 text-sm">
          <li>Your account balance</li>
          <li>Maximum risk per trade</li>
          <li>Stop loss distance</li>
        </ul>
      </div>
      
      <div className="bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">Risk Limits</h4>
        <p className="text-sm mb-2">
          The system enforces multiple layers of protection:
        </p>
        <ul className="list-disc pl-5 text-sm">
          <li>Maximum risk per trade (% of account)</li>
          <li>Daily and weekly loss limits</li>
          <li>Maximum drawdown protection</li>
        </ul>
      </div>
    </div>
    
    <div className="mt-6 bg-positive/5 border border-positive/20 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-2 text-positive">The 2% Rule</h3>
      <p>
        Professional traders typically risk no more than 2% of their account on any single trade.
        This ensures that even a string of losing trades won't significantly deplete your capital.
      </p>
      <div className="mt-2">
        <div className="font-medium">Example:</div>
        <p className="text-sm">
          With a $10,000 account and 2% risk per trade, you would risk no more than $200 per trade.
          Even with 5 consecutive losses (unlikely with ForexJoey's high-accuracy signals), you would
          still have $9,000 remaining to continue trading.
        </p>
      </div>
    </div>
  </div>
);

const MultiSourceStep: React.FC = () => (
  <div className="space-y-4">
    <p>
      ForexJoey's edge comes from its multi-source intelligence system. No signal is generated
      without confirmation from at least two independent analysis methods.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">Technical Analysis</h4>
        <p className="text-sm">
          Analyzes price action, indicators, and chart patterns to identify potential entry points.
        </p>
        <div className="mt-2">
          <div className="text-xs text-muted-foreground">Indicators Used:</div>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">MACD</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">RSI</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">Moving Averages</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">Bollinger Bands</span>
          </div>
        </div>
      </div>
      
      <div className="bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">Fundamental Analysis</h4>
        <p className="text-sm">
          Examines economic factors, central bank policies, and global events that impact currency values.
        </p>
        <div className="mt-2">
          <div className="text-xs text-muted-foreground">Factors Analyzed:</div>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">Interest Rates</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">Inflation</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">GDP Growth</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">Central Bank Statements</span>
          </div>
        </div>
      </div>
      
      <div className="bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">Sentiment Analysis</h4>
        <p className="text-sm">
          Evaluates market sentiment through news, social media, and institutional positioning.
        </p>
        <div className="mt-2">
          <div className="text-xs text-muted-foreground">Data Sources:</div>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">Financial News</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">Social Media</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">COT Reports</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">Institutional Flows</span>
          </div>
        </div>
      </div>
      
      <div className="bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">Economic Calendar</h4>
        <p className="text-sm">
          Tracks economic events, releases, and their potential impact on currency pairs.
        </p>
        <div className="mt-2">
          <div className="text-xs text-muted-foreground">Event Types:</div>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">NFP</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">CPI/Inflation</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">Rate Decisions</span>
            <span className="px-2 py-0.5 bg-accent/10 text-xs rounded">Trade Balance</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-6 bg-accent/5 border border-accent/20 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-2 text-accent">AI Reasoning</h3>
      <p>
        ForexJoey's AI engine weighs all these intelligence sources, cross-validates signals,
        and provides a clear explanation for every trading recommendation. You'll always know
        exactly why a signal was generated.
      </p>
    </div>
  </div>
);

interface AccountSetupProps {
  accountSetup: {
    accountBalance: number;
    maxRiskPerTrade: number;
    maxDailyLoss: number;
    experienceLevel: string;
  };
  onChange: (values: any) => void;
}

const AccountSetupStep: React.FC<AccountSetupProps> = ({ accountSetup, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...accountSetup, [field]: value });
  };
  
  return (
    <div className="space-y-6">
      <p>
        Let's set up your account with optimal risk parameters. These settings can always
        be adjusted later in your profile.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Account Balance (USD)
          </label>
          <input
            type="number"
            min="100"
            step="100"
            value={accountSetup.accountBalance}
            onChange={(e) => handleChange('accountBalance', parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-input rounded-md"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This will be used to calculate appropriate position sizes.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Maximum Risk Per Trade (%)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={accountSetup.maxRiskPerTrade}
              onChange={(e) => handleChange('maxRiskPerTrade', parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="w-16 text-right font-mono">{accountSetup.maxRiskPerTrade}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Recommended: 1-2% for beginners, 2-3% for experienced traders.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Maximum Daily Loss (%)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={accountSetup.maxDailyLoss}
              onChange={(e) => handleChange('maxDailyLoss', parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="w-16 text-right font-mono">{accountSetup.maxDailyLoss}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Trading will pause if this daily loss limit is reached.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Trading Experience
          </label>
          <select
            value={accountSetup.experienceLevel}
            onChange={(e) => handleChange('experienceLevel', e.target.value)}
            className="w-full px-3 py-2 bg-input rounded-md"
          >
            <option value="beginner">Beginner (Less than 1 year)</option>
            <option value="intermediate">Intermediate (1-3 years)</option>
            <option value="advanced">Advanced (3+ years)</option>
            <option value="professional">Professional Trader</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            This helps us tailor educational content to your experience level.
          </p>
        </div>
      </div>
      
      <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 mt-6">
        <h3 className="text-warning font-medium mb-2">Risk Disclosure</h3>
        <p className="text-sm">
          Forex trading involves substantial risk of loss and is not suitable for all investors.
          Past performance is not indicative of future results. ForexJoey's AI signals are designed
          to maximize accuracy, but no trading system can guarantee profits.
        </p>
      </div>
    </div>
  );
};

const CompleteStep: React.FC = () => (
  <div className="text-center space-y-6">
    <div className="flex justify-center mb-6">
      <div className="w-24 h-24 bg-positive/20 rounded-full flex items-center justify-center text-positive">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    
    <h3 className="text-xl font-bold">You're All Set!</h3>
    
    <p>
      Your account has been configured with optimal risk parameters.
      ForexJoey is now ready to provide you with high-accuracy trading signals.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <div className="bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">1. Review Signals</h4>
        <p className="text-sm">
          Check your dashboard for the latest trading opportunities
        </p>
      </div>
      
      <div className="bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">2. Understand Analysis</h4>
        <p className="text-sm">
          Each signal includes detailed reasoning from multiple sources
        </p>
      </div>
      
      <div className="bg-card shadow-sm rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-2">3. Manage Risk</h4>
        <p className="text-sm">
          Use the risk management tools to ensure capital protection
        </p>
      </div>
    </div>
    
    <div className="mt-8">
      <Link
        href="/dashboard"
        className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg inline-block"
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default OnboardingFlow;
