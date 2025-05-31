# ForexJoey Environment Setup Guide

This guide explains how to set up the different environments for ForexJoey's frontend and backend components, ensuring proper connectivity between them.

## Environment Overview

ForexJoey uses a multi-environment architecture to support its AI-first, forex-only autonomous agent capabilities:

1. **Local Development Environment**
   - Backend: Running locally on `http://localhost:8000`
   - Frontend: Running locally on `http://localhost:3000`
   - Purpose: Initial development and testing

2. **Development Environment**
   - Backend: Deployed from `development` branch to `https://forexjoey-backend-dev.onrender.com`
   - Frontend: Deployed from `development` branch to `https://forexjoey-dev.vercel.app`
   - Purpose: Testing new features, intelligence sources, and integrations

3. **Production Environment**
   - Backend: Deployed from `main` branch to `https://forexjoey-backend.onrender.com`
   - Frontend: Deployed from `main` branch to `https://forexjoey.vercel.app`
   - Purpose: Live trading and production access

## Frontend Environment Configuration

1. **Create Environment Files**

   Copy the `.env.example` file to create the following environment-specific files:

   ```bash
   # For local development
   cp frontend/.env.example frontend/.env.local
   
   # For development environment
   cp frontend/.env.example frontend/.env.development
   
   # For production environment
   cp frontend/.env.example frontend/.env.production
   ```

2. **Configure Each Environment**

   Edit each file to set the appropriate environment:

   ```bash
   # In .env.local
   NEXT_PUBLIC_APP_ENV=local
   
   # In .env.development
   NEXT_PUBLIC_APP_ENV=development
   
   # In .env.production
   NEXT_PUBLIC_APP_ENV=production
   ```

3. **Vercel Deployment Configuration**

   When deploying to Vercel, configure the environment variables in the Vercel dashboard:
   
   - For production deployment (from `main` branch):
     - Set `NEXT_PUBLIC_APP_ENV=production`
   
   - For development deployment (from `development` branch):
     - Set `NEXT_PUBLIC_APP_ENV=development`

## Backend Environment Configuration

The backend environment is controlled through the `render.yaml` file and environment variables in Render:

1. **Production Environment (main branch)**
   - Environment variable: `ENVIRONMENT=production`
   - Log level: `LOG_LEVEL=INFO`
   - CORS origins: `CORS_ORIGINS=https://forexjoey.vercel.app,http://localhost:3000`

2. **Development Environment (development branch)**
   - Environment variable: `ENVIRONMENT=development`
   - Log level: `LOG_LEVEL=DEBUG`
   - CORS origins: `CORS_ORIGINS=https://forexjoey-dev.vercel.app,http://localhost:3000`

## Multi-Intelligence Source Configuration

ForexJoey requires at least 2 intelligence sources for all trading signals. Configure these in each environment:

1. **Technical Analysis**
   - Requires: OANDA API credentials
   - Purpose: Price data and technical indicators

2. **Sentiment Analysis**
   - Requires: NewsAPI credentials
   - Purpose: Market sentiment from news and social media

3. **AI Prediction**
   - Requires: OpenAI/Anthropic API credentials
   - Purpose: Pattern recognition and prediction

4. **Fundamental Data**
   - Requires: Alpha Vantage/Trading Economics credentials
   - Purpose: Economic indicators and fundamental analysis

5. **Reflection Engine**
   - Internal system
   - Purpose: Learning from past trades to improve future performance

## Testing Environment Connectivity

To verify that your frontend is correctly connecting to the intended backend:

1. **Local Development**
   ```bash
   # Start backend
   ./start-backend.sh
   
   # In another terminal, start frontend
   cd frontend
   npm run dev
   ```

2. **Development/Production**
   - Visit your deployed frontend URL
   - Check the network requests in browser dev tools to confirm they're going to the correct backend URL
   - Verify in the application logs that at least 2 intelligence sources are active

## Troubleshooting

If you encounter connectivity issues:

1. Check that the environment variables are correctly set
2. Verify CORS settings in the backend
3. Check network requests in browser dev tools for errors
4. Ensure all required API keys are configured
5. Verify that the backend services are running (check Render dashboard)

Remember that ForexJoey is designed to operate independently with high-accuracy decision making, which requires all intelligence sources to be properly configured and accessible.
