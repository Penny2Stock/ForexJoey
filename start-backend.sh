#!/bin/bash
# ForexJoey Backend Startup Script
echo "🚀 Starting ForexJoey AI Backend..."

# Determine and activate virtual environment
if [ -d ".venv" ]; then
    echo "Using project root virtual environment..."
    source .venv/bin/activate
else
    echo "Using backend-specific virtual environment..."
    source backend/venv/bin/activate
fi

# Start the backend server
cd backend
echo "Initializing ForexJoey's AI-first, multi-intelligence backend..."
echo "Connecting to Supabase and OANDA API..."
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Deactivate virtual environment on exit
deactivate
