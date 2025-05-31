# ForexJoey Project Structure

```
/New-forex-joey/
├── README.md                 # Project overview and setup instructions
├── PRD.md                    # Product Requirements Document
├── Forex-joey.md             # Project vision and technical details
├── .gitignore                # Git ignore file
├── docker-compose.yml        # Docker configuration for local development
│
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI application entry point
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py     # Application configuration
│   │   │   ├── security.py   # Authentication and security
│   │   │   └── logging.py    # Logging configuration
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py       # API dependencies
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py   # Authentication endpoints
│   │   │   │   ├── signals.py # Trading signals endpoints
│   │   │   │   ├── market.py # Market data endpoints
│   │   │   │   ├── user.py   # User management endpoints
│   │   │   │   └── trading.py # Trading execution endpoints
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py       # User models
│   │   │   ├── signal.py     # Trading signal models
│   │   │   ├── market.py     # Market data models
│   │   │   └── trading.py    # Trading execution models
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py       # User schemas
│   │   │   ├── signal.py     # Trading signal schemas
│   │   │   ├── market.py     # Market data schemas
│   │   │   └── trading.py    # Trading execution schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── ai_engine.py  # AI analysis engine
│   │   │   ├── oanda.py      # OANDA API integration
│   │   │   ├── technical.py  # Technical analysis
│   │   │   ├── fundamental.py # Fundamental analysis
│   │   │   ├── calendar.py   # Economic calendar
│   │   │   └── sentiment.py  # Sentiment analysis
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── session.py    # Database session
│   │   │   └── crud/
│   │   │       ├── __init__.py
│   │   │       ├── user.py   # User CRUD operations
│   │   │       ├── signal.py # Signal CRUD operations
│   │   │       └── trading.py # Trading CRUD operations
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── helpers.py    # Helper functions
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py       # Test configuration
│   │   ├── test_api/
│   │   │   ├── __init__.py
│   │   │   ├── test_auth.py
│   │   │   ├── test_signals.py
│   │   │   └── test_trading.py
│   │   └── test_services/
│   │       ├── __init__.py
│   │       ├── test_ai_engine.py
│   │       └── test_technical.py
│   ├── Dockerfile            # Dockerfile for backend
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Example environment variables
│
├── frontend/                 # Next.js frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   ├── manifest.json     # PWA manifest
│   │   └── icons/            # App icons
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx    # Root layout
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register/
│   │   │   │       └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── signals/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── market/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── portfolio/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │   └── api/
│   │   │       └── auth/
│   │   │           └── [...nextauth]/
│   │   │               └── route.ts
│   │   ├── components/
│   │   │   ├── ui/           # UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/       # Layout components
│   │   │   │   ├── header.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   └── footer.tsx
│   │   │   ├── charts/       # Chart components
│   │   │   │   ├── price-chart.tsx
│   │   │   │   ├── performance-chart.tsx
│   │   │   │   └── indicator-chart.tsx
│   │   │   ├── signals/      # Signal components
│   │   │   │   ├── signal-card.tsx
│   │   │   │   ├── signal-details.tsx
│   │   │   │   └── signal-history.tsx
│   │   │   ├── market/       # Market components
│   │   │   │   ├── currency-pair.tsx
│   │   │   │   ├── economic-calendar.tsx
│   │   │   │   └── news-feed.tsx
│   │   │   └── auth/         # Auth components
│   │   │       ├── login-form.tsx
│   │   │       └── register-form.tsx
│   │   ├── lib/
│   │   │   ├── api.ts        # API client
│   │   │   ├── auth.ts       # Auth utilities
│   │   │   ├── utils.ts      # Utility functions
│   │   │   └── supabase.ts   # Supabase client
│   │   ├── hooks/
│   │   │   ├── use-auth.ts   # Auth hook
│   │   │   ├── use-signals.ts # Signals hook
│   │   │   └── use-market.ts # Market data hook
│   │   ├── types/
│   │   │   ├── index.ts      # Type definitions
│   │   │   ├── user.ts       # User types
│   │   │   ├── signal.ts     # Signal types
│   │   │   └── market.ts     # Market types
│   │   └── styles/
│   │       └── globals.css   # Global styles
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── next.config.js        # Next.js configuration
│   ├── package.json          # NPM dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   └── .env.example          # Example environment variables
│
├── ai-engine/                # AI engine components
│   ├── models/
│   │   ├── __init__.py
│   │   ├── technical.py      # Technical analysis models
│   │   ├── fundamental.py    # Fundamental analysis models
│   │   ├── sentiment.py      # Sentiment analysis models
│   │   └── combined.py       # Combined analysis models
│   ├── data/
│   │   ├── __init__.py
│   │   ├── oanda.py          # OANDA data fetcher
│   │   ├── calendar.py       # Economic calendar data
│   │   ├── news.py           # News data fetcher
│   │   └── preprocessing.py  # Data preprocessing
│   ├── analysis/
│   │   ├── __init__.py
│   │   ├── technical.py      # Technical analysis
│   │   ├── fundamental.py    # Fundamental analysis
│   │   ├── sentiment.py      # Sentiment analysis
│   │   └── combined.py       # Combined analysis
│   ├── llm/
│   │   ├── __init__.py
│   │   ├── openai.py         # OpenAI integration
│   │   ├── claude.py         # Claude integration
│   │   ├── llama.py          # Llama integration
│   │   └── prompts.py        # LLM prompts
│   ├── trading/
│   │   ├── __init__.py
│   │   ├── signals.py        # Signal generation
│   │   ├── execution.py      # Trade execution
│   │   └── risk.py           # Risk management
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_technical.py
│   │   ├── test_fundamental.py
│   │   └── test_sentiment.py
│   ├── Dockerfile            # Dockerfile for AI engine
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Example environment variables
│
├── supabase/                 # Supabase configuration
│   ├── migrations/           # Database migrations
│   │   ├── 20230101000000_initial.sql
│   │   └── ...
│   ├── functions/            # Edge functions
│   │   ├── market-data/
│   │   │   └── index.ts
│   │   ├── economic-calendar/
│   │   │   └── index.ts
│   │   └── signal-generator/
│   │       └── index.ts
│   └── seed.sql              # Seed data
│
└── docs/                     # Documentation
    ├── architecture.md       # Architecture documentation
    ├── api.md                # API documentation
    ├── deployment.md         # Deployment documentation
    ├── development.md        # Development documentation
    ├── ui-ux-design.md       # UI/UX design documentation
    └── images/               # Documentation images
```
