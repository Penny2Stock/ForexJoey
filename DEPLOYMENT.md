# ForexJoey Deployment Guide

This guide provides step-by-step instructions for deploying the ForexJoey application to production environments.

## Backend Deployment (Render)

### Prerequisites
- GitHub repository with your ForexJoey code
- Render account
- Required API keys (OANDA, OpenAI, NewsAPI, Alpaca)

### Deployment Steps

1. **Fix Dependencies**
   - Ensure `requirements.txt` has the correct versions:
     - `websockets==10.4` (not 11.0.3, which causes compatibility issues)
     - `gunicorn==21.2.0` (required for Render deployment)

2. **Configure Render Blueprint**
   - We've created a `render.yaml` file in the backend directory
   - This configures the service with the correct build and start commands

3. **Deploy to Render**
   - Push your code to GitHub
   - In the Render dashboard, select "New" and choose "Blueprint"
   - Connect your GitHub repository
   - Render will detect the `render.yaml` file and configure the service

4. **Set Environment Variables**
   - In the Render dashboard, set the following environment variables:
     - `OANDA_API_KEY` - Your OANDA API key for forex data
     - `OANDA_ACCOUNT_ID` - Your OANDA account ID
     - `JWT_SECRET_KEY` - Secret key for JWT token generation
     - `OPENAI_API_KEY` - OpenAI API key for AI reasoning
     - `NEWSAPI_KEY` - News API key for sentiment analysis
     - `ALPACA_API_KEY` - Alpaca API key for market data
     - `ALPACA_API_SECRET` - Alpaca API secret

5. **Verify Deployment**
   - Once deployed, check the logs for any errors
   - Test the API endpoints using the Swagger UI at `https://[your-render-url]/docs`

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub repository with your ForexJoey code
- Vercel account
- Backend already deployed and running

### Deployment Steps

1. **Configure Environment Variables**
   - Create a `.env.production` file in the frontend directory with:
     ```
     NEXT_PUBLIC_APP_ENV=production
     NEXT_PUBLIC_API_BASE_URL=https://[your-render-backend-url]/api
     NEXT_PUBLIC_WS_URL=wss://[your-render-backend-url]/api/ws
     ```

2. **Fix Next.js Configuration**
   - Ensure `next.config.js` has the correct configuration:
     - Disable TypeScript build errors temporarily
     - Configure webpack for WebSocket compatibility
     - Set environment variables

3. **Fix WebSocket Implementation**
   - Use the SSR-safe WebSocket implementation we've created
   - Ensure all browser-only code is properly guarded with `typeof window !== 'undefined'` checks

4. **Deploy to Vercel**
   - Push your code to GitHub
   - In the Vercel dashboard, import your repository
   - Set the environment variables:
     - `NEXT_PUBLIC_APP_ENV=production`
     - `NEXT_PUBLIC_API_BASE_URL=https://[your-render-backend-url]/api`
     - `NEXT_PUBLIC_WS_URL=wss://[your-render-backend-url]/api/ws`
   - Deploy the application

5. **Verify Deployment**
   - Once deployed, check for any build errors in the Vercel logs
   - Test the application functionality, especially WebSocket connections

## Troubleshooting

### Backend Issues
- **Missing gunicorn**: Ensure `gunicorn` is in your `requirements.txt`
- **WebSocket compatibility**: Use `websockets==10.4` instead of newer versions
- **Environment variables**: Verify all required variables are set in Render

### Frontend Issues
- **Build errors**: Check Vercel build logs for specific TypeScript or module errors
- **WebSocket connection**: Ensure WebSocket URLs are correct and the backend is accessible
- **SSR compatibility**: Make sure all browser-only code is properly guarded

## Monitoring and Maintenance

- Regularly check the logs in both Render and Vercel for any issues
- Monitor the performance of your API endpoints
- Keep your dependencies updated, but be cautious with major version upgrades

## Security Considerations

- Never commit API keys or secrets to your repository
- Use environment variables for all sensitive information
- Implement proper authentication and authorization
- Regularly rotate your JWT secret key

---

By following this guide, you should be able to successfully deploy ForexJoey to production environments. If you encounter any issues, refer to the troubleshooting section or check the logs for specific error messages.
