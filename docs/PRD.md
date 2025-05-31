# ForexJoey AI Agent - Product Requirements Document (PRD)

## 1. Product Overview

### 1.1 Product Vision
ForexJoey is an AI-first, forex-only autonomous agent designed to provide high-accuracy trading decisions for forex traders of all experience levels. The product focuses on delivering institutional-grade analysis and trading signals at an affordable price point, making sophisticated forex trading accessible to retail traders.

### 1.2 Target Audience
- First-time forex traders with limited knowledge
- Gen Z traders looking for modern, tech-driven solutions
- Retail traders seeking institutional-grade analysis
- Part-time traders who need automated assistance
- Trading enthusiasts looking to improve their decision-making

### 1.3 Business Goals
- Acquire 1,000 free users within 3 months of launch
- Convert 10% of free users to paid subscriptions
- Achieve 80% user retention rate
- Generate $10,000 monthly recurring revenue within 6 months
- Maintain a 4.5+ star rating on app stores

## 2. Product Features

### 2.1 Core Features

#### 2.1.1 AI-Powered Trading Signals
- ✅ Real-time trading signals with entry/exit points
- Risk assessment and position sizing recommendations
- ✅ Multiple timeframe analysis (M15, H1, H4, D1, W1)
- ✅ Signal confidence score with explanation (0-100%)
- ✅ Multi-source intelligence fusion (Technical, Fundamental, Economic, Sentiment)
- ✅ Detailed breakdown of analysis factors with impact scores
- ✅ Visual representation of trade parameters
- ✅ Historical performance tracking

#### 2.1.2 Economic Intelligence
- ✅ Economic calendar integration with event impact analysis
- ✅ News sentiment analysis for major currencies
- Central bank statement analysis
- ✅ Market trend identification
- Correlation analysis between currency pairs

#### 2.1.3 Autonomous Trading
- ✅ OANDA API integration for automated trading
- Risk management rules and position sizing
- ✅ Stop-loss and take-profit management
- ✅ Trade journaling and performance tracking
- ✅ Custom trading strategy configuration

#### 2.1.4 Learning & Education
- ✅ Explanation of trading decisions with factor breakdown
- ✅ Interactive tutorials on forex fundamentals
- ✅ AI-generated market insights based on current conditions
- ✅ Personalized learning path based on user skill level
- ✅ Glossary of forex terms with context-sensitive help
- ✅ Visualization of AI's continuous learning process
- ✅ Performance metrics and factor accuracy tracking
- ✅ Personalized learning recommendations
- ✅ Trading terminology glossary

### 2.2 User Experience

#### 2.2.1 Dashboard
- Real-time market overview with currency pair status via WebSockets
- Active signals with confidence scores and direction
- Performance metrics and account statistics
- AI intelligence performance tracking with accuracy metrics
- Factor importance visualization showing how AI weights different sources
- Economic calendar with impact indicators
- News feed with AI-powered sentiment analysis
- Quick access to recently viewed currency pairs
- Customizable watchlist
- Educational tips for beginners
- Visual representation of daily signal allowance

#### 2.2.2 Signal Details
- Comprehensive analysis breakdown with visual components
- Technical indicators with impact scores and interpretations
- Fundamental factors with source attribution
- Economic events with expected vs. actual results
- Sentiment analysis from multiple sources with confidence levels
- AI reasoning explanation in simple language
- AI reflection on similar past signals and outcomes
- Interactive price chart with entry/exit points
- Real-time price updates via WebSockets
- Risk/reward visualization
- Expected timeframe for trade completion
- Real-time performance tracking
- One-click trade execution option

#### 2.2.3 Account Management
- Portfolio overview
- Trading history and performance
- AI performance metrics by currency pair and timeframe
- Continuous learning insights and lessons
- Risk profile configuration
- Subscription management
- Notification preferences
- WebSocket connection management

#### 2.2.4 Mobile Experience
- Progressive Web App functionality
- Real-time push notifications for signals via WebSockets
- Live price updates and alerts
- Quick trade execution
- Simplified dashboard for mobile
- AI performance metrics on-the-go
- Biometric authentication

## 3. Technical Requirements

### 3.1 Backend Architecture
- ✅ FastAPI for RESTful API endpoints
- ✅ Supabase for database, authentication, and real-time subscriptions
- ✅ Custom WebSocket server for live market data and signal updates
- ✅ Real-time OANDA price streaming integration
- ✅ AI reflection system for continuous learning from trade outcomes
- ✅ User settings and preferences persistence
- ✅ Scheduled tasks for data aggregation and economic calendar updates
- ✅ Asynchronous processing for AI analysis
- ✅ Rate limiting and caching for external API optimization
- ✅ Modular service architecture for each intelligence source
- ✅ Authentication with JWT tokens and role-based access control
- ✅ Comprehensive error handling and logging

### 3.2 AI Engine
- ✅ Multi-LLM strategy utilizing OpenAI GPT-4 Turbo and Claude 3.5 Sonnet
- ✅ Technical analysis engine using TA-Lib and pandas-ta with 150+ indicators
- ✅ Economic calendar intelligence with event impact prediction
- ✅ Sentiment analysis using FinBERT and social media trend detection
- ✅ Signal generation requiring minimum of 2+ intelligence sources
- ✅ Confidence scoring algorithm based on multi-factor agreement
- ✅ Advanced reflection system that analyzes trade outcomes and optimizes factor weights
- ✅ Continuous learning mechanism with performance tracking by currency pair/timeframe
- ✅ Autonomous performance optimization based on historical accuracy
- ✅ AI-generated insights and lessons learned from trading outcomes
- ✅ Fallback analysis methods for API outages
- ✅ Transparent reasoning with detailed factor breakdown
- ✅ Cost-optimization through strategic LLM selection

### 3.3 Data Sources
- ✅ OANDA v20 API for live forex data and real-time price streaming
- ✅ Economic calendars (Forex Factory, Trading Economics)
- ✅ Financial news APIs (NewsAPI, Alpha Vantage)
- ✅ Social sentiment (Reddit, Twitter)
- ✅ Historical backtesting data
- ✅ Real-time WebSocket connections for market updates
- ✅ Sentiment analysis pipelines for news and social media
- ✅ Performance metrics database for AI reflection

### 3.4 Frontend
- ✅ Next.js 14 for server-side rendering and app router
- ✅ TailwindCSS with custom design system for sleek, futuristic UI
- ✅ Framer Motion for smooth animations and micro-interactions
- ✅ Lightweight-charts for performance-optimized financial charts
- ✅ Real-time updates with WebSockets and React custom hooks
- ✅ Live price streaming and signal notifications
- ✅ AI performance dashboard with visualization of learning metrics
- ✅ Factor weight and accuracy tracking with interactive charts
- Mobile-first, responsive design targeting Gen Z users
- ✅ Dark mode as default with light mode option
- Educational tooltips and guided experiences for beginners
- Accessibility features for all users

### 3.5 Deployment & Infrastructure
- Frontend deployed on Vercel
- Backend services on Render
- ✅ Database on Supabase
- CI/CD pipeline with GitHub Actions
- Monitoring and logging with Sentry

## 4. Monetization Strategy

### 4.1 Freemium Model
- **Free Tier**:
  - Limited number of signals per day (3)
  - Basic technical analysis
  - Delayed economic calendar
  - Standard charts and indicators
  - Web access only

- **Premium Tier ($10/month)**:
  - Unlimited trading signals
  - Advanced technical and fundamental analysis
  - Real-time economic calendar with impact analysis
  - Advanced charting with custom indicators
  - Mobile app access with notifications
  - Trading automation capabilities
  - Priority support

### 4.2 Revenue Streams
- Monthly subscriptions
- Annual subscriptions (10% discount)
- Premium educational content
- API access for developers
- White-label solutions for brokers

## 5. Success Metrics

### 5.1 User Engagement
- Daily active users
- Time spent on platform
- Number of signals viewed
- Educational content consumed
- Feature usage statistics

### 5.2 Trading Performance
- Signal accuracy rate
- User profit/loss ratio
- Risk-adjusted returns
- Drawdown metrics
- Comparison to benchmark indices

### 5.3 Business Metrics
- User acquisition cost
- Conversion rate (free to paid)
- Monthly recurring revenue
- Customer lifetime value
- Churn rate

## 6. Development Approach & Roadmap

### 6.1 Development Philosophy: Hybrid Approach with Backend Priority

ForexJoey will be developed using a hybrid approach that prioritizes backend functionality while developing a minimal frontend in parallel. This approach ensures:

- Core AI functionality and data processing are established early
- Trading logic and OANDA integration are thoroughly tested
- Early visual feedback for stakeholders and potential users
- Continuous integration and testing of both components
- Ability to pivot based on technical constraints or user feedback

### 6.2 Phase 1: Core Backend Foundation (Weeks 1-4)
- ✅ FastAPI backend structure with API routes for auth, signals, and market data
- ✅ Supabase database initialization with user and signal models
- ✅ OANDA v20 API integration for live forex data
- ✅ Technical analysis engine with 150+ indicators
- Economic calendar integration with impact analysis
- ✅ JWT-based authentication system
- ✅ Next.js frontend with dashboard, signals, and market pages
- ✅ Dark mode UI with sleek, futuristic design system

### 6.3 Phase 2: AI Engine & Basic UI (Weeks 5-8)
- ✅ Technical analysis engine with TA-Lib
- Economic calendar integration
- News sentiment analysis pipeline with FinBERT and OpenAI
- ✅ WebSocket infrastructure for real-time data delivery
- ✅ Enhanced dashboard with real-time market data
- ✅ Signal display components with sentiment visualization
- ✅ User profile and settings management with Supabase integration
- AI reflection system foundation
- ✅ Initial mobile responsiveness

### 6.4 Phase 3: Advanced Features (Weeks 9-12)
- Combined technical + fundamental + sentiment signal generation
- Advanced AI reflection system for trade outcome analysis
- Continuous learning algorithm with factor weight optimization
- Real-time trade execution via OANDA
- Risk management and position sizing
- ✅ Enhanced UI with detailed signal analysis
- ✅ AI performance dashboard with learning visualization
- ✅ Chart components with technical indicators
- User onboarding flow
- ✅ Performance tracking components

### 6.5 Phase 4: Refinement & Scaling (Weeks 13-16)
- Backtesting engine with historical data
- Advanced UI with customizable dashboard
- Educational content integration
- Mobile PWA optimization
- Push notifications
- Subscription management
- Performance optimization

### 6.6 Phase 5: Production & Growth (Weeks 17-20)
- Final UI polish and animations
- Comprehensive testing and bug fixes
- Production deployment
- Analytics implementation
- Marketing website
- User feedback collection system
- Continuous improvement process

## 6.7 Current Priority Implementation Items

Based on ForexJoey's AI-first focus on high-accuracy decision making, the following items are prioritized for immediate implementation:

### 6.7.1 Multi-source Intelligence Engine ⚠️
- ✅ Economic calendar integration (critical for fundamental analysis)
- ✅ News sentiment analysis with FinBERT and OpenAI
- ✅ Complete the AI reflection system to learn from trade outcomes

### 6.7.2 Signal Generation & Decision Making ⚠️
- ✅ Combined technical + fundamental + sentiment signal generation (essential for the 2+ intelligence sources rule)
- ✅ Continuous learning algorithm with factor weight optimization

### 6.7.3 Trade Execution & Risk Management ⚠️
- ✅ Real-time trade execution via OANDA
- Risk management and position sizing (critical for capital protection)
- User onboarding flow with risk education

## 7. Risks & Mitigations

### 7.1 Technical Risks
- **API Rate Limits**: Implement intelligent caching and request batching
- **Model Accuracy**: Continuous training and performance monitoring
- **System Downtime**: Redundant systems and failover mechanisms
- **Data Quality**: Multiple data sources and validation checks
- **Scalability Issues**: Cloud-native architecture with auto-scaling

### 7.2 Business Risks
- **Low Conversion Rate**: A/B testing of features and pricing
- **High Churn**: Focus on user education and engagement
- **Regulatory Compliance**: Legal review and transparent disclaimers
- **Competitive Pressure**: Continuous innovation and unique AI capabilities
- **Market Volatility**: Robust risk management and diversification

## 8. Legal & Compliance

### 8.1 Disclaimers
- Not financial advice with clear disclaimers throughout the application
- Past performance not indicative of future results
- Detailed risk disclosure statements
- Comprehensive terms of service and privacy policy
- Transparent data usage and sharing policies
- Educational content on risk management
- Clear separation between analysis and advice
- Prominent display of risk warnings for beginners
- Regular reminder notifications about trading risks
- Account loss prevention features and warnings

### 8.2 Regulatory Considerations
- Compliance with financial regulations
- Data protection (GDPR, CCPA)
- Security standards (SOC 2, ISO 27001)
- API usage terms and conditions
- Intellectual property protection

## 9. Launch Plan

### 9.1 Beta Testing
- Closed beta with 50-100 selected users from diverse trading backgrounds
- Structured feedback collection via in-app surveys and interviews
- A/B testing of UI components for Gen Z and beginner usability
- Signal accuracy performance benchmarking against manual analysis
- Systematic bug tracking and prioritized fixing
- User experience refinement based on heatmap and session recording
- Load testing for concurrent users and API requests
- Mobile device compatibility testing
- Security and penetration testing
- Accessibility compliance verification

### 9.2 Marketing Strategy
- Content marketing (blog, tutorials)
- Social media presence
- Forex community engagement
- Influencer partnerships
- Referral program

### 9.3 Launch Timeline
- Pre-launch teaser campaign (2 weeks)
- Closed beta (4 weeks)
- Open beta (2 weeks)
- Official launch
- Post-launch support and iteration

## 10. Future Expansion

### 10.1 Feature Expansion
- Additional asset classes (crypto, commodities)
- Advanced portfolio management
- Custom strategy builder
- Social trading capabilities
- Institutional-grade tools

### 10.2 Market Expansion
- Localization for key markets
- Regional economic focus
- Multi-language support
- Regional payment methods
- Local regulatory compliance
