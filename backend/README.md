# ForexJoey Backend

ForexJoey is an AI-first, forex-only autonomous agent that prioritizes high-accuracy decision making.

## Deployment to Render

The backend is configured for deployment on Render using the `render.yaml` configuration file.

### Deployment Steps

1. Push your code to GitHub
2. In the Render dashboard, select "New" and choose "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and configure the service
5. Set up the required environment variables in the Render dashboard:
   - `OANDA_API_KEY` - Your OANDA API key for forex data
   - `OANDA_ACCOUNT_ID` - Your OANDA account ID
   - `JWT_SECRET_KEY` - Secret key for JWT token generation
   - `OPENAI_API_KEY` - OpenAI API key for AI reasoning
   - `NEWSAPI_KEY` - News API key for sentiment analysis
   - `ALPACA_API_KEY` - Alpaca API key for market data
   - `ALPACA_API_SECRET` - Alpaca API secret

### Troubleshooting

If you encounter deployment issues:

1. Check the Render logs for specific error messages
2. Ensure all required environment variables are set
3. Verify that the Python version is set to 3.9.0
4. Make sure the `gunicorn` package is included in `requirements.txt`
5. Ensure the websockets package version is compatible (10.4 recommended)

## Local Development

To run the backend locally:

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn app.main:app --reload
```

## API Documentation

Once the server is running, access the API documentation at:
- Swagger UI: `https://[your-render-url]/docs`
- ReDoc: `https://[your-render-url]/redoc`
