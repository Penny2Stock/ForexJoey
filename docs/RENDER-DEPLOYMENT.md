# ForexJoey Backend Deployment Guide (Render)

This guide walks through deploying the ForexJoey AI-first, forex-only autonomous agent backend to Render.

## Prerequisites

1. A [Render account](https://render.com)
2. Your ForexJoey codebase in a GitHub repository
3. Access to your API keys (Supabase, OANDA, etc.)

## Deployment Steps

### 1. Push Your Code to GitHub

If your code isn't already in a GitHub repository:

```bash
cd /Users/qb10x/New-forex-joey
git init
git add .
git commit -m "Initial commit for ForexJoey deployment"
git remote add origin https://github.com/yourusername/forexjoey.git
git push -u origin main
```

### 2. Connect Render to Your GitHub Repository

1. Log in to your Render account
2. Click "New" and select "Blueprint"
3. Connect your GitHub account if you haven't already
4. Select your ForexJoey repository
5. Render will automatically detect the `render.yaml` configuration

### 3. Configure Environment Variables

Set the following environment variables in the Render dashboard:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL (https://frmnaifkkepkmsukpjes.supabase.co) |
| `SUPABASE_KEY` | Your Supabase anon key |
| `OANDA_API_KEY` | Your OANDA API key |
| `OANDA_ACCOUNT_ID` | Your OANDA account ID |
| `OPENAI_API_KEY` | Your OpenAI API key for AI signal generation |
| `ANTHROPIC_API_KEY` | Your Claude API key for multi-LLM strategy |
| `NEWS_API_KEY` | Your NewsAPI key for sentiment analysis |
| `ALPHA_VANTAGE_KEY` | Your Alpha Vantage API key for financial data |
| `TRADING_ECONOMICS_KEY` | Your Trading Economics API key |

### 4. Deploy Your Service

1. Click "Create Blueprint" to start the deployment
2. Render will build and deploy your ForexJoey backend
3. Once deployed, you'll receive a URL for your backend API (e.g., `https://forexjoey-backend.onrender.com`)

### 5. Update Frontend Configuration

Update your frontend's `.env.local` file to point to your new backend URL:

```
# Add this to frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=https://forexjoey-backend.onrender.com/api
```

## Verifying Deployment

To verify your deployment is working correctly:

1. Visit `https://forexjoey-backend.onrender.com/` in your browser
2. You should see the ForexJoey API health check response
3. Test a specific endpoint: `https://forexjoey-backend.onrender.com/api/market/instruments`

## Multi-Intelligence Source Requirements

ForexJoey requires at least 2 intelligence sources for all trading signals. Ensure the following APIs are properly configured:

1. OANDA API (for price data and trading execution)
2. OpenAI API (for AI signal generation)
3. NewsAPI (for sentiment analysis)
4. Alpha Vantage (for financial indicators)

## Continuous Deployment

Render automatically deploys new changes when you push to your GitHub repository. This enables:

1. Continuous improvement of ForexJoey's AI models
2. Regular updates to trading strategies
3. Enhanced reflection mechanisms for performance optimization

## Troubleshooting

If you encounter issues:

1. Check the Render logs for error messages
2. Verify all environment variables are correctly set
3. Ensure your Supabase project is accessible
4. Check CORS settings if the frontend cannot connect

For additional help, refer to the [Render documentation](https://render.com/docs) or the ForexJoey project README.
