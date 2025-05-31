# ForexJoey Backend Deployment Guide (Render)

This guide walks through deploying the ForexJoey AI-first, forex-only autonomous agent backend to Render, following our branch-based development workflow.

## Prerequisites

1. A [Render account](https://render.com)
2. Your ForexJoey codebase in a GitHub repository (https://github.com/Penny2Stock/ForexJoey.git)
3. Access to your API keys (Supabase, OANDA, etc.)
4. Both `main` and `development` branches set up in your repository

## Deployment Architecture

ForexJoey uses a dual-environment deployment strategy:

1. **Production Environment** (from `main` branch)
   - Deployed at: https://forexjoey-backend.onrender.com
   - Contains only thoroughly tested code
   - Used for live trading and production access

2. **Development Environment** (from `development` branch)
   - Deployed at: https://forexjoey-backend-dev.onrender.com
   - Used for testing new features and integrations
   - Allows verification of multi-intelligence source accuracy

## Deployment Steps

### 1. Connect Render to Your GitHub Repository

1. Log in to your Render account
2. Click "New" and select "Blueprint"
3. Connect your GitHub account if you haven't already
4. Select the ForexJoey repository (https://github.com/Penny2Stock/ForexJoey.git)
5. Render will automatically detect the `render.yaml` configuration which defines both environments

### 2. Configure Environment Variables

Set the following environment variables for both services in the Render dashboard:

| Variable | Description | Production | Development |
|----------|-------------|------------|-------------|
| `ENVIRONMENT` | Environment name | `production` | `development` |
| `SUPABASE_URL` | Your Supabase project URL | Same | Same |
| `SUPABASE_KEY` | Your Supabase anon key | Same | Same |
| `OANDA_API_KEY` | Your OANDA API key | Same | Same |
| `OANDA_ACCOUNT_ID` | Your OANDA account ID | Same | Same |
| `OANDA_ENVIRONMENT` | OANDA environment | `practice` (or `live`) | `practice` |
| `OPENAI_API_KEY` | OpenAI API key for AI signals | Same | Same |
| `ANTHROPIC_API_KEY` | Claude API key for multi-LLM strategy | Same | Same |
| `NEWS_API_KEY` | NewsAPI key for sentiment analysis | Same | Same |
| `ALPHA_VANTAGE_KEY` | Alpha Vantage API key | Same | Same |
| `TRADING_ECONOMICS_KEY` | Trading Economics API key | Same | Same |
| `LOG_LEVEL` | Logging verbosity | `INFO` | `DEBUG` |
| `CORS_ORIGINS` | Allowed frontend origins | Production URLs | Dev URLs |

### 3. Deploy Your Services

1. Click "Create Blueprint" to start the deployment
2. Render will build and deploy both ForexJoey backend environments
3. Once deployed, you'll receive URLs for both environments:
   - Production: `https://forexjoey-backend.onrender.com`
   - Development: `https://forexjoey-backend-dev.onrender.com`

### 4. Update Frontend Configuration

Update your frontend's environment files to point to the correct backend URLs:

```bash
# For production (.env.production)
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://forexjoey-backend.onrender.com/api
NEXT_PUBLIC_WS_URL=wss://forexjoey-backend.onrender.com/api/ws

# For development (.env.development)
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_DEV_API_URL=https://forexjoey-backend-dev.onrender.com/api
NEXT_PUBLIC_DEV_WS_URL=wss://forexjoey-backend-dev.onrender.com/api/ws

# For local development (.env.local)
NEXT_PUBLIC_APP_ENV=local
```

## Verifying Deployment

To verify your deployments are working correctly:

### Production Environment
1. Visit `https://forexjoey-backend.onrender.com/` in your browser
2. You should see the ForexJoey API health check response
3. Test a specific endpoint: `https://forexjoey-backend.onrender.com/api/market/instruments`

### Development Environment
1. Visit `https://forexjoey-backend-dev.onrender.com/` in your browser
2. You should see the ForexJoey API health check response with development mode indicators
3. Test a specific endpoint: `https://forexjoey-backend-dev.onrender.com/api/market/instruments`

## Multi-Intelligence Source Requirements

ForexJoey requires at least 2 intelligence sources for all trading signals. Ensure the following APIs are properly configured in both environments:

1. **Technical Analysis** (OANDA API for price data and indicators)
2. **AI Signal Generation** (OpenAI API for pattern recognition)
3. **Sentiment Analysis** (NewsAPI for market sentiment)
4. **Fundamental Data** (Alpha Vantage for economic indicators)
5. **Reflection Engine** (Internal system for learning from past trades)

## Continuous Deployment Workflow

Render automatically deploys new changes when you push to your GitHub repository:

1. Push to `development` branch → Updates development environment
2. Merge `development` into `main` → Updates production environment

This enables:
- Continuous improvement of ForexJoey's AI models
- Testing of new trading strategies in isolation
- Enhanced reflection mechanisms for performance optimization
- Safe deployment of only thoroughly tested code to production

## Monitoring and Logging

1. **Development Environment**: More verbose logging (`DEBUG` level)
   - View detailed logs in the Render dashboard
   - Use for debugging and development

2. **Production Environment**: Standard logging (`INFO` level)
   - Focus on important events and errors
   - Monitor for trading performance

## Troubleshooting

If you encounter issues:

1. Check the Render logs for error messages
2. Verify all environment variables are correctly set
3. Ensure your Supabase project is accessible
4. Check CORS settings if the frontend cannot connect
5. Verify that at least 2 intelligence sources are operational

For additional help, refer to the [Render documentation](https://render.com/docs) or the ForexJoey project documentation.
