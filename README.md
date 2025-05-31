# ForexJoey - AI-First Forex Trading Assistant

![ForexJoey Logo](frontend/public/logo.svg)

ForexJoey is an AI-first, forex-only autonomous agent designed to provide high-accuracy trading decisions for forex traders of all experience levels. The platform focuses on delivering institutional-grade analysis and trading signals at an affordable price point, making sophisticated forex trading accessible to retail traders.

## 🚀 Core Features

### AI Trading Intelligence
- **Multi-Source Intelligence**: Combines technical analysis, economic data, and sentiment analysis to generate high-confidence trading signals
- **Continuous Learning**: Reflects on trade outcomes to improve future decision-making
- **Explainable AI**: Every prediction comes with detailed reasoning and confidence metrics

### Trading Capabilities
- **Real-time Trading Signals**: Entry/exit points with stop-loss and take-profit levels
- **Multiple Timeframe Analysis**: Supports M15, H1, H4, D1, and W1 timeframes
- **Risk Management**: Adaptive position sizing and account protection rules
- **OANDA API Integration**: Direct trade execution with professional-grade broker

### User Experience
- **Modern Dashboard**: Real-time market data via WebSockets with TradingView chart integration
- **Bot Control Panel**: Configure trading parameters and risk settings
- **Activity Log**: Track bot actions and recent trades
- **Multi-Currency Support**: Analysis for major and minor forex pairs

## 🔧 Technical Architecture

### Frontend
- **Next.js 14**: Server-side rendering with App Router
- **TailwindCSS**: Custom design system with dark mode
- **WebSocket Integration**: Real-time market data and signal updates
- **TradingView Charts**: Professional-grade charting capabilities

### Backend
- **FastAPI**: High-performance API endpoints
- **Supabase**: Database, authentication, and real-time capabilities
- **Edge Functions**: Serverless functions for trade execution and analysis
- **WebSockets**: Real-time market data and signal distribution

### AI Engine
- **Multi-LLM Strategy**: Leverages OpenAI GPT-4 and Claude 3.5 for enhanced decision-making
- **Technical Analysis**: 150+ indicators for comprehensive market analysis
- **Sentiment Analysis**: News and social media sentiment tracking
- **Reflection System**: Analyzes trade outcomes to optimize future decisions

### Data Sources
- **OANDA v20 API**: Live forex data and trading execution
- **Economic Calendars**: Forex Factory, Trading Economics
- **News APIs**: NewsAPI, Alpha Vantage
- **Social Sentiment**: Reddit, Twitter analysis

## 📊 Current Implementation Status

### Completed
- ✅ AI Trading Assistant page with TradingView chart integration
- ✅ Bot control panel for managing trading settings
- ✅ Activity log for tracking bot actions
- ✅ Currency pair selection and multi-timeframe analysis
- ✅ Enhanced AI Training Prompt with API Integration and Reflection Mechanism
- ✅ Database schema with tables for signals, trades, reflections, and intelligence weights
- ✅ Supabase Edge Functions:
  - ✅ `execute-trade`: Handles trade execution with risk management
  - ✅ `trade-reflection`: Analyzes outcomes and adjusts intelligence source weights
  - ✅ `websocket-server`: Provides real-time market data and signal updates
  - ✅ `_shared-oanda`: Utility class for OANDA API integration
  - ✅ `risk-management`: Enforces risk parameters and capital protection

### In Progress
- 🔄 Economic calendar integration
- 🔄 News sentiment analysis pipeline
- 🔄 User subscription management
- 🔄 Mobile responsiveness enhancements

### Planned
- 📝 Backtesting functionality
- 📝 Advanced portfolio analytics
- 📝 Social trading capabilities
- 📝 Educational content expansion
- 📝 Performance optimization for mobile devices

## 🛠️ Project Structure

```
/New-forex-joey/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py           # FastAPI application entry point
│   │   ├── api/              # API endpoints
│   │   ├── models/           # Data models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   └── utils/            # Helper functions
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js app router
│   │   ├── components/       # React components
│   │   ├── lib/              # Utility functions
│   │   └── hooks/            # Custom React hooks
│   └── package.json          # NPM dependencies
│
├── ai-engine/                # AI analysis components
│   ├── models/               # AI models
│   ├── data/                 # Data processing
│   ├── analysis/             # Analysis logic
│   └── llm/                  # LLM integrations
│
└── docs/                     # Documentation
    ├── PRD.md                # Product Requirements Document
    ├── Joey-Prompt.md        # AI agent training prompt
    ├── Forex-joey.md         # Project vision
    └── project-structure.md  # Detailed structure
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Supabase account
- OANDA API account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/New-forex-joey.git
cd New-forex-joey
```

2. Set up the frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure your environment variables
```

3. Set up the backend
```bash
cd ../backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Configure your environment variables
```

4. Start the development servers
```bash
# In the frontend directory
npm run dev

# In the backend directory
uvicorn app.main:app --reload
```

## 📝 Environment Variables

The following environment variables are required:

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000/ws
```

### Backend (.env)
```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OANDA_API_KEY=your-oanda-api-key
OANDA_ACCOUNT_ID=your-oanda-account-id
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## 🔒 Security

- Row Level Security (RLS) policies implemented in Supabase
- JWT authentication for API access
- Environment variables for sensitive credentials

## 📈 Roadmap

### Short-term (1-3 months)
- Complete economic calendar integration
- Implement news sentiment analysis pipeline
- Enhance WebSocket infrastructure
- Improve mobile responsiveness

### Medium-term (3-6 months)
- Add backtesting functionality
- Implement social trading capabilities
- Expand educational content
- Optimize performance for mobile devices

### Long-term (6+ months)
- Develop advanced portfolio analytics
- Add support for additional brokers
- Implement institutional-grade tools
- Expand to additional markets

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).
