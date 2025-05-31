import React from 'react';
import { motion } from 'framer-motion';
import { 
  RiArrowUpSLine, 
  RiArrowDownSLine,
  RiNewspaperLine,
  RiEmotionLine
} from 'react-icons/ri';

interface Article {
  title: string;
  source: string;
  sentiment_score: number;
  explanation: string;
}

interface SentimentData {
  sentiment_score: number;
  confidence: number;
  direction: string;
  strength: string;
  news_count: number;
  top_articles: Article[];
  explanation: string;
}

interface SentimentPanelProps {
  data: SentimentData;
  isExpanded: boolean;
  onToggle: () => void;
}

const SentimentPanel: React.FC<SentimentPanelProps> = ({ data, isExpanded, onToggle }) => {
  // Format sentiment score as percentage and determine color
  const sentimentPercent = Math.round(Math.abs(data.sentiment_score) * 100);
  const sentimentColor = data.direction === 'bullish' 
    ? 'text-positive' 
    : data.direction === 'bearish' 
      ? 'text-negative' 
      : 'text-yellow-400';

  // Format confidence as percentage
  const confidencePercent = Math.round(data.confidence * 100);
  
  return (
    <div className="rounded-lg bg-card shadow-md overflow-hidden mb-4">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer" 
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="bg-secondary/20 p-2 rounded-full">
            <RiEmotionLine className="text-xl" />
          </div>
          <div>
            <h3 className="font-medium">Market Sentiment Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Based on {data.news_count} news sources
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`font-bold ${sentimentColor}`}>
              {data.direction.toUpperCase()} {sentimentPercent}%
            </div>
            <div className="text-xs text-muted-foreground">
              {data.strength.toUpperCase()} • {confidencePercent}% Confidence
            </div>
          </div>
          
          {isExpanded ? (
            <RiArrowUpSLine className="text-xl" />
          ) : (
            <RiArrowDownSLine className="text-xl" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 pb-4"
        >
          <div className="mb-4 p-3 bg-secondary/10 rounded-md">
            <p className="text-sm">{data.explanation}</p>
          </div>
          
          {data.top_articles.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <RiNewspaperLine /> 
                Key News Articles
              </h4>
              
              <div className="space-y-3">
                {data.top_articles.map((article, index) => {
                  const articleSentiment = article.sentiment_score > 0.2
                    ? 'positive' 
                    : article.sentiment_score < -0.2
                      ? 'negative'
                      : 'neutral';
                      
                  const sentimentClass = 
                    articleSentiment === 'positive' 
                      ? 'border-l-positive' 
                      : articleSentiment === 'negative'
                        ? 'border-l-negative'
                        : 'border-l-yellow-400';
                  
                  return (
                    <div 
                      key={index}
                      className={`border-l-4 ${sentimentClass} pl-3 py-1`}
                    >
                      <div className="font-medium text-sm">{article.title}</div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{article.source}</span>
                        <span className={
                          articleSentiment === 'positive' 
                            ? 'text-positive' 
                            : articleSentiment === 'negative' 
                              ? 'text-negative' 
                              : 'text-yellow-400'
                        }>
                          {articleSentiment.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs mt-1">{article.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SentimentPanel;
