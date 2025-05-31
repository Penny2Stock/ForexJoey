/**
 * AI Insights Panel Component
 * 
 * Displays the AI's continuous learning capabilities, performance metrics,
 * and insights learned from previous trading outcomes.
 */

import React, { useState, useEffect } from 'react';
import { Card, Divider, Typography, Badge, Tooltip, Progress, List, Spin, Alert, Tabs } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { BrainCircuit, LightBulb, ChartBar, Clock, ArrowUp, ArrowDown } from '@heroicons/react/24/outline';
import apiService from '@/services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const FACTOR_COLORS = {
  technical: '#0088FE',
  fundamental: '#00C49F',
  sentiment: '#FFBB28',
  economic: '#FF8042'
};

interface AIInsightsPanelProps {
  currencyPair?: string;
  timeframe?: string;
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

interface AIInsight {
  signal_id: string;
  currency_pair: string;
  direction: string;
  timeframe: string;
  lessons_learned: string[];
  created_at: string;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ currencyPair, timeframe }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch performance metrics
        if (currencyPair && timeframe) {
          const metricsData = await apiService.reflection.getPerformanceMetrics(currencyPair, timeframe);
          setMetrics(metricsData);
        } else {
          // If no specific pair/timeframe is provided, get the first available metrics
          const allMetrics = await apiService.reflection.getAllPerformanceMetrics();
          if (allMetrics && allMetrics.length > 0) {
            setMetrics(allMetrics[0]);
          }
        }
        
        // Fetch AI insights
        const insightsData = await apiService.reflection.getAiInsights(10);
        setInsights(insightsData);
      } catch (err) {
        console.error('Error fetching AI insights data:', err);
        setError('Failed to load AI insights data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currencyPair, timeframe]);

  // Prepare data for factor weights chart
  const getFactorWeightsData = () => {
    if (!metrics) return [];
    
    return Object.entries(metrics.factor_weights).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value * 100
    }));
  };

  // Prepare data for factor accuracy chart
  const getFactorAccuracyData = () => {
    if (!metrics) return [];
    
    return Object.entries(metrics.factor_accuracy).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value * 100
    }));
  };

  // Prepare data for recent signals chart
  const getRecentSignalsData = () => {
    if (!metrics || !metrics.recent_signals) return [];
    
    return metrics.recent_signals.map((signal, index) => ({
      name: `Signal ${index + 1}`,
      accuracy: signal.was_accurate ? 100 : 0,
      date: new Date(signal.timestamp).toLocaleDateString(),
      time: new Date(signal.timestamp).toLocaleTimeString()
    }));
  };

  if (loading) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <Spin size="large" tip="Loading AI insights..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <Alert message="Error" description={error} type="error" showIcon />
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md">
      <div className="flex items-center mb-4">
        <BrainCircuit className="h-6 w-6 text-blue-500 mr-2" />
        <Title level={4} className="m-0">AI Continuous Learning</Title>
      </div>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Performance Metrics" key="1">
          {metrics ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card size="small" className="bg-gray-50">
                  <div className="text-center">
                    <Text type="secondary">Currency Pair</Text>
                    <div className="text-xl font-bold">{metrics.currency_pair}</div>
                  </div>
                </Card>
                <Card size="small" className="bg-gray-50">
                  <div className="text-center">
                    <Text type="secondary">Timeframe</Text>
                    <div className="text-xl font-bold">{metrics.timeframe}</div>
                  </div>
                </Card>
                <Card size="small" className="bg-gray-50">
                  <div className="text-center">
                    <Text type="secondary">Total Signals</Text>
                    <div className="text-xl font-bold">{metrics.total_signals}</div>
                  </div>
                </Card>
                <Card size="small" className="bg-gray-50">
                  <div className="text-center">
                    <Text type="secondary">Accuracy Rate</Text>
                    <div className="text-xl font-bold">
                      {(metrics.accuracy_rate * 100).toFixed(1)}%
                    </div>
                  </div>
                </Card>
              </div>
              
              <Divider orientation="left">Factor Importance & Accuracy</Divider>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Title level={5}>Intelligence Factor Weights</Title>
                  <Text type="secondary">How the AI weights different factors in its decision making</Text>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={getFactorWeightsData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      >
                        {getFactorWeightsData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <Title level={5}>Factor Accuracy</Title>
                  <Text type="secondary">How accurate each intelligence source has been</Text>
                  <div className="space-y-2 mt-4">
                    {Object.entries(metrics.factor_accuracy).map(([factor, accuracy]) => (
                      <div key={factor}>
                        <div className="flex justify-between mb-1">
                          <Text>{factor.charAt(0).toUpperCase() + factor.slice(1)}</Text>
                          <Text>{(accuracy * 100).toFixed(1)}%</Text>
                        </div>
                        <Progress 
                          percent={Number((accuracy * 100).toFixed(1))} 
                          status={accuracy >= 0.7 ? "success" : accuracy >= 0.5 ? "normal" : "exception"}
                          strokeColor={FACTOR_COLORS[factor as keyof typeof FACTOR_COLORS]}
                          showInfo={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Divider orientation="left">Recent Signal Performance</Divider>
              
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={getRecentSignalsData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} ticks={[0, 50, 100]} />
                  <RechartsTooltip 
                    formatter={(value: number) => value === 100 ? 'Accurate' : 'Inaccurate'}
                    labelFormatter={(value: string, payload: any) => {
                      if (payload && payload.length > 0) {
                        return `${payload[0].payload.date} ${payload[0].payload.time}`;
                      }
                      return value;
                    }}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Alert 
              message="No performance metrics available" 
              description="The AI has not yet gathered enough data for this currency pair and timeframe. Check back after more signals have been generated."
              type="info" 
              showIcon 
            />
          )}
        </TabPane>
        
        <TabPane tab="AI Insights" key="2">
          <div className="space-y-4">
            <div className="flex items-center">
              <LightBulb className="h-5 w-5 text-yellow-500 mr-2" />
              <Title level={5} className="m-0">Lessons Learned From Trading</Title>
            </div>
            
            {insights.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={insights}
                renderItem={(insight) => (
                  <List.Item>
                    <div className="border rounded-md p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between mb-2">
                        <Badge color={insight.direction === 'BUY' ? 'green' : 'red'}>
                          <span className="font-semibold">{insight.currency_pair} ({insight.timeframe})</span>
                        </Badge>
                        <Tooltip title={new Date(insight.created_at).toLocaleString()}>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(insight.created_at).toLocaleDateString()}
                          </div>
                        </Tooltip>
                      </div>
                      
                      <div className="mt-2">
                        <List
                          size="small"
                          dataSource={insight.lessons_learned}
                          renderItem={(lesson) => (
                            <List.Item className="py-1 px-0 border-0">
                              <div className="flex">
                                <ChartBar className="h-5 w-5 text-blue-500 flex-shrink-0 mr-2" />
                                <Text>{lesson}</Text>
                              </div>
                            </List.Item>
                          )}
                        />
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Alert 
                message="No insights available" 
                description="The AI has not yet generated insights from trading outcomes. Check back after more signals have been analyzed."
                type="info" 
                showIcon 
              />
            )}
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default AIInsightsPanel;
