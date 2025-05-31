'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Select, Spin, Alert, Row, Col, Statistic, Divider, Tabs, Space } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useMarketUpdates } from '@/services/websocket';
import apiService from '@/services/api';
import AIInsightsPanel from '@/components/reflection/AIInsightsPanel';
import DashboardLayout from '@/components/layout/DashboardLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Common currency pairs
const CURRENCY_PAIRS = [
  'EUR/USD',
  'GBP/USD',
  'USD/JPY',
  'AUD/USD',
  'USD/CAD',
  'USD/CHF',
  'NZD/USD',
  'EUR/GBP',
  'EUR/JPY',
  'GBP/JPY'
];

// Timeframes
const TIMEFRAMES = [
  'M5',
  'M15',
  'M30',
  'H1',
  'H4',
  'D',
  'W',
  'M'
];

interface SignalData {
  id: string;
  currency_pair: string;
  direction: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  timeframe: string;
  confidence_score: number;
  status: string;
  ai_reasoning: string;
  intelligence_sources: any;
  created_at: string;
}

interface PerformanceMetrics {
  currency_pair: string;
  timeframe: string;
  total_signals: number;
  accurate_signals: number;
  accuracy_rate: number;
  factor_weights: {
    technical: number;
    fundamental: number;
    sentiment: number;
    economic: number;
  };
  factor_accuracy: {
    technical: number;
    fundamental: number;
    sentiment: number;
    economic: number;
  };
  recent_signals: Array<{
    timestamp: string;
    was_accurate: boolean;
  }>;
}

interface AggregateMetrics {
  total_signals: number;
  accurate_signals: number;
  overall_accuracy: number;
  pairs_analyzed: number;
  best_performing_pair: string;
  best_performing_accuracy: number;
  most_analyzed_pair: string;
}

const AIPerformancePage: React.FC = () => {
  const [currencyPair, setCurrencyPair] = useState<string>('EUR/USD');
  const [timeframe, setTimeframe] = useState<string>('H1');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [allMetrics, setAllMetrics] = useState<PerformanceMetrics[]>([]);
  const [aggregateMetrics, setAggregateMetrics] = useState<AggregateMetrics | null>(null);
  const [recentSignals, setRecentSignals] = useState<SignalData[]>([]);
  
  // Get real-time price data using WebSocket
  const priceData = useMarketUpdates(currencyPair);

  // Calculate aggregate metrics from all performance data
  const calculateAggregateMetrics = (metricsData: PerformanceMetrics[]) => {
    if (!metricsData || metricsData.length === 0) return null;
    
    const totalSignals = metricsData.reduce((sum, metric) => sum + metric.total_signals, 0);
    const accurateSignals = metricsData.reduce((sum, metric) => sum + metric.accurate_signals, 0);
    
    // Find best performing pair
    let bestPair = '';
    let bestAccuracy = 0;
    let mostAnalyzedPair = '';
    let mostAnalyzedCount = 0;
    
    metricsData.forEach(metric => {
      if (metric.accuracy_rate > bestAccuracy) {
        bestAccuracy = metric.accuracy_rate;
        bestPair = `${metric.currency_pair} (${metric.timeframe})`;
      }
      
      if (metric.total_signals > mostAnalyzedCount) {
        mostAnalyzedCount = metric.total_signals;
        mostAnalyzedPair = `${metric.currency_pair} (${metric.timeframe})`;
      }
    });
    
    return {
      total_signals: totalSignals,
      accurate_signals: accurateSignals,
      overall_accuracy: totalSignals > 0 ? accurateSignals / totalSignals : 0,
      pairs_analyzed: new Set(metricsData.map(m => m.currency_pair)).size,
      best_performing_pair: bestPair,
      best_performing_accuracy: bestAccuracy,
      most_analyzed_pair: mostAnalyzedPair
    };
  };

  // Fetch performance metrics and recent signals
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all metrics first
        const allMetricsData = await apiService.reflection.getAllPerformanceMetrics();
        setAllMetrics(allMetricsData || []);
        
        // Calculate aggregate metrics
        const aggMetrics = calculateAggregateMetrics(allMetricsData);
        setAggregateMetrics(aggMetrics);
        
        // Fetch specific metrics for selected pair and timeframe
        const metricsData = await apiService.reflection.getPerformanceMetrics(currencyPair, timeframe);
        setMetrics(metricsData);
        
        // Fetch recent signals
        const signalsData = await apiService.signals.getSignals({ limit: 10 });
        setRecentSignals(signalsData);
      } catch (err) {
        console.error('Error fetching AI performance data:', err);
        setError('Failed to load AI performance data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currencyPair, timeframe]);

  // Prepare data for pair performance chart
  const getPairPerformanceData = () => {
    if (!allMetrics || allMetrics.length === 0) return [];
    
    return allMetrics.map(metric => ({
      name: metric.currency_pair,
      accuracy: Math.round(metric.accuracy_rate * 100),
      signals: metric.total_signals
    })).sort((a, b) => b.signals - a.signals).slice(0, 10);
  };

  // Prepare data for factor importance chart
  const getFactorImportanceData = () => {
    if (!metrics || !metrics.factor_weights) return [];
    
    return Object.entries(metrics.factor_weights).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value * 100)
    }));
  };

  // Handle currency pair change
  const handleCurrencyPairChange = (value: string) => {
    setCurrencyPair(value);
  };

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title level={2}>AI Performance & Learning</Title>
          
          <div className="flex items-center space-x-4">
            <Select
              value={currencyPair}
              onChange={handleCurrencyPairChange}
              style={{ width: 120 }}
            >
              {CURRENCY_PAIRS.map(pair => (
                <Option key={pair} value={pair}>{pair}</Option>
              ))}
            </Select>
            
            <Select
              value={timeframe}
              onChange={handleTimeframeChange}
              style={{ width: 80 }}
            >
              {TIMEFRAMES.map(tf => (
                <Option key={tf} value={tf}>{tf}</Option>
              ))}
            </Select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading AI performance data..." />
          </div>
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : (
          <>
            {/* Overview Statistics */}
            {aggregateMetrics && (
              <Row gutter={16}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Overall Accuracy"
                      value={Math.round(aggregateMetrics.overall_accuracy * 100)}
                      suffix="%"
                      precision={1}
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<ArrowUpOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Signals Analyzed"
                      value={aggregateMetrics.total_signals}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Currency Pairs Analyzed"
                      value={aggregateMetrics.pairs_analyzed}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Best Performing"
                      value={aggregateMetrics.best_performing_pair}
                      suffix={`(${Math.round(aggregateMetrics.best_performing_accuracy * 100)}%)`}
                      valueStyle={{ fontSize: '16px' }}
                    />
                  </Card>
                </Col>
              </Row>
            )}
            
            <Row gutter={16}>
              {/* Pair Performance Chart */}
              <Col span={12}>
                <Card title="Currency Pair Performance">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={getPairPerformanceData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="accuracy" name="Accuracy %" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="signals" name="Total Signals" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              
              {/* Factor Importance Chart */}
              <Col span={12}>
                <Card title={`Intelligence Factor Weights (${currencyPair} ${timeframe})`}>
                  {metrics ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getFactorImportanceData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {getFactorImportanceData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <Text type="secondary">No data available for this currency pair and timeframe</Text>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
            
            <Divider />
            
            {/* AI Insights Panel */}
            <AIInsightsPanel currencyPair={currencyPair} timeframe={timeframe} />
            
            {/* Real-time Price Data */}
            {priceData && (
              <Card title={`Live Price Data: ${currencyPair}`} className="mt-6">
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title="Bid"
                      value={priceData.bid}
                      precision={5}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Ask"
                      value={priceData.ask}
                      precision={5}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Mid"
                      value={priceData.mid}
                      precision={5}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Spread"
                      value={priceData.spread}
                      precision={5}
                      suffix="pips"
                    />
                  </Col>
                </Row>
                <Text type="secondary">
                  Last Updated: {new Date(priceData.time).toLocaleString()}
                </Text>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AIPerformancePage;
