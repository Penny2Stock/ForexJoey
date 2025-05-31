'use client';

import React, { useState, useEffect } from 'react';
import { riskManagement } from '@/services/supabase';

interface RiskAssessmentProps {
  currencyPair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  onAssessmentComplete?: (assessment: any) => void;
}

/**
 * RiskAssessment Component
 * 
 * This component handles risk assessment for trades based on the user's risk profile.
 * It implements ForexJoey's capital protection principles, ensuring that each trade
 * adheres to proper risk management rules.
 */
const RiskAssessment: React.FC<RiskAssessmentProps> = ({
  currencyPair,
  direction,
  entryPrice,
  stopLoss,
  takeProfit,
  timeframe,
  onAssessmentComplete
}) => {
  const [positionSize, setPositionSize] = useState<number>(0.1);
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Risk assessment calculation
  const calculateRisk = async () => {
    try {
      setLoading(true);
      setError(null);

      const riskData = await riskManagement.assessTradeRisk({
        currency_pair: currencyPair,
        direction,
        entry_price: entryPrice,
        stop_loss: stopLoss,
        take_profit: takeProfit,
        position_size: positionSize,
        timeframe
      });

      setAssessment(riskData);
      
      if (onAssessmentComplete) {
        onAssessmentComplete(riskData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assess risk');
      console.error('Risk assessment error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-recalculate when inputs change
  useEffect(() => {
    if (currencyPair && direction && entryPrice && stopLoss && takeProfit) {
      calculateRisk();
    }
  }, [currencyPair, direction, entryPrice, stopLoss, takeProfit, positionSize]);

  const getStatusColor = () => {
    if (!assessment) return 'bg-card';
    return assessment.is_compliant 
      ? 'bg-card border-l-4 border-success text-success shadow-neon' 
      : 'bg-card border-l-4 border-destructive text-destructive';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="mt-4 w-full">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Position Size</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.01"
                max="10"
                step="0.01"
                value={positionSize}
                onChange={(e) => setPositionSize(parseFloat(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={positionSize}
                onChange={(e) => setPositionSize(parseFloat(e.target.value))}
                className="bg-input text-foreground rounded px-2 py-1 w-24 text-right"
              />
            </div>
          </div>
          
          <button 
            onClick={calculateRisk}
            disabled={loading || !currencyPair}
            className="px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg text-white font-medium transition-colors"
          >
            {loading ? 'Calculating...' : 'Calculate Risk'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
          {error}
        </div>
      )}
      
      {assessment && (
        <div className={`p-4 rounded-lg ${getStatusColor()} transition-all duration-300 ease-in-out`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
            <h3 className="text-lg font-bold">
              Risk Assessment
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${assessment.is_compliant ? 'text-success' : 'text-destructive'}`}>
                {assessment.is_compliant ? 'Compliant' : 'Non-Compliant'}
              </span>
              <div className={`h-3 w-3 rounded-full ${assessment.is_compliant ? 'bg-success pulse-glow' : 'bg-destructive'}`}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="glass-card p-3">
              <div className="text-sm text-muted-foreground">Risk Amount</div>
              <div className="text-xl font-mono font-semibold data-value">
                {formatCurrency(assessment.risk_amount)}
              </div>
            </div>
            
            <div className="glass-card p-3">
              <div className="text-sm text-muted-foreground">Risk Percentage</div>
              <div className="text-xl font-mono font-semibold data-value">
                {assessment.risk_percentage.toFixed(2)}%
              </div>
            </div>
            
            <div className="glass-card p-3">
              <div className="text-sm text-muted-foreground">Risk:Reward Ratio</div>
              <div className="text-xl font-mono font-semibold data-value">
                1:{assessment.risk_reward_ratio.toFixed(2)}
              </div>
            </div>
          </div>
          
          {assessment.drawdown && (
            <div className="glass-card p-3 mb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <div className="text-sm text-muted-foreground">Account Drawdown</div>
                <div className={`text-sm font-medium ${
                  assessment.drawdown.status === 'normal' ? 'text-success' :
                  assessment.drawdown.status === 'caution' ? 'text-warning' :
                  assessment.drawdown.status === 'warning' ? 'text-warning' :
                  'text-destructive'
                }`}>
                  {assessment.drawdown.status.toUpperCase()}
                </div>
              </div>
              <div className="w-full bg-background rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    assessment.drawdown.status === 'normal' ? 'bg-success' :
                    assessment.drawdown.status === 'caution' ? 'bg-warning' :
                    assessment.drawdown.status === 'warning' ? 'bg-warning' :
                    'bg-destructive'
                  }`}
                  style={{ width: `${Math.min(100, assessment.drawdown.current)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Current: {assessment.drawdown.current.toFixed(2)}%</span>
                <span>Max Allowed: {assessment.drawdown.max_allowed.toFixed(2)}%</span>
              </div>
            </div>
          )}
          
          {!assessment.is_compliant && assessment.compliance_issues && (
            <div className="glass-card p-3 mb-4 border-l-2 border-destructive">
              <h4 className="font-medium mb-2">Risk Management Issues:</h4>
              <ul className="list-disc pl-5 text-sm">
                {assessment.compliance_issues.map((issue: string, index: number) => (
                  <li key={index} className="mb-1">{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {assessment.recommended_position_size !== positionSize && (
            <div className="glass-card p-3 mb-4 border-l-2 border-accent">
              <h4 className="font-medium mb-2">Recommendation:</h4>
              <p className="text-sm">
                Based on your risk profile, the recommended position size is{' '}
                <strong className="text-accent">{assessment.recommended_position_size.toFixed(2)}</strong>
              </p>
              <button
                onClick={() => setPositionSize(assessment.recommended_position_size)}
                className="mt-2 px-3 py-1 bg-accent/20 hover:bg-accent/40 text-accent rounded text-sm transition-colors"
              >
                Apply Recommended Size
              </button>
            </div>
          )}
          
          {assessment.ai_reasoning && (
            <div className="glass-card p-3">
              <h4 className="font-medium mb-2">ForexJoey AI Analysis:</h4>
              <p className="text-sm">{assessment.ai_reasoning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
