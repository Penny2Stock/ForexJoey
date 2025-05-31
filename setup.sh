#!/bin/bash
# ForexJoey Development Environment Setup Script
# This script sets up both frontend and backend environments

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   ForexJoey Development Setup Tool    ${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo -e "\n${BLUE}Checking required tools...${NC}"
if ! command_exists python3; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3 before continuing.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}Node.js is not installed. Please install Node.js before continuing.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}npm is not installed. Please install npm before continuing.${NC}"
    exit 1
fi

# Function to check environment files
check_environment_files() {
    echo -e "\n${BLUE}Checking environment files...${NC}"
    
    # Check backend .env
    if [ -f "backend/.env" ]; then
        echo "Backend .env file found. Checking required variables..."
        
        missing_vars_backend=""
        
        # Read the .env file
        while IFS="=" read -r key value || [ -n "$key" ]; do
            # Skip comments and empty lines
            [[ $key =~ ^\#.*$ || -z $key ]] && continue
            
            # Check if value is empty or placeholder
            if [[ -z "$value" || "$value" == *"your_"*"_here" ]]; then
                missing_vars_backend="$missing_vars_backend\n  - $key"
            fi
        done < backend/.env
        
        if [ -n "$missing_vars_backend" ]; then
            echo -e "${YELLOW}WARNING: The following backend environment variables need to be set:${NC}$missing_vars_backend"
        else
            echo -e "${GREEN}All backend environment variables are set.${NC}"
        fi
    else
        echo -e "${YELLOW}WARNING: No backend .env file found. Creating template...${NC}"
        create_backend_env_template
    fi
    
    # Check frontend .env.local
    if [ -f "frontend/.env.local" ]; then
        echo "Frontend .env.local file found. Checking required variables..."
        
        missing_vars_frontend=""
        
        # Read the .env.local file
        while IFS="=" read -r key value || [ -n "$key" ]; do
            # Skip comments and empty lines
            [[ $key =~ ^\#.*$ || -z $key ]] && continue
            
            # Check if value is empty or placeholder
            if [[ -z "$value" || "$value" == *"your_"*"_here" ]]; then
                missing_vars_frontend="$missing_vars_frontend\n  - $key"
            fi
        done < frontend/.env.local
        
        if [ -n "$missing_vars_frontend" ]; then
            echo -e "${YELLOW}WARNING: The following frontend environment variables need to be set:${NC}$missing_vars_frontend"
        else
            echo -e "${GREEN}All frontend environment variables are set.${NC}"
        fi
    else
        echo -e "${YELLOW}WARNING: No frontend .env.local file found. Creating template...${NC}"
        create_frontend_env_template
    fi
}

# Create backend .env template
create_backend_env_template() {
    cat > backend/.env << 'EOF'
# Supabase Configuration
SUPABASE_URL=https://frmnaifkkepkmsukpjes.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OANDA API Configuration (for trading functionality)
OANDA_API_URL=https://api-fxpractice.oanda.com
OANDA_API_KEY=your_oanda_api_key_here
OANDA_ACCOUNT_ID=your_oanda_account_id_here

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Claude API Configuration
CLAUDE_API_KEY=your_anthropic_api_key_here

# Financial News APIs
NEWS_API_KEY=your_newsapi_key_here
ALPHA_VANTAGE_API_KEY=your_alphavantage_key_here

# Economic Calendar APIs
TRADING_ECONOMICS_API_KEY=your_tradingeconomics_key_here
FOREX_FACTORY_API_KEY=your_forexfactory_key_here

# Database Configuration
DATABASE_URL=your_database_url_here
EOF
    echo -e "${GREEN}Backend .env template created. Please update with your actual values.${NC}"
}

# Create frontend .env.local template
create_frontend_env_template() {
    cat > frontend/.env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://frmnaifkkepkmsukpjes.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OANDA API Configuration (for trading functionality)
NEXT_PUBLIC_OANDA_API_URL=https://api-fxpractice.oanda.com
OANDA_API_KEY=your_oanda_api_key_here
OANDA_ACCOUNT_ID=your_oanda_account_id_here

# OpenAI API Configuration (for AI signal generation and sentiment analysis)
OPENAI_API_KEY=your_openai_api_key_here

# Claude API Configuration (for multi-LLM strategy)
CLAUDE_API_KEY=your_anthropic_api_key_here

# Financial News APIs
NEWS_API_KEY=your_newsapi_key_here
ALPHA_VANTAGE_API_KEY=your_alphavantage_key_here

# Economic Calendar APIs
TRADING_ECONOMICS_API_KEY=your_tradingeconomics_key_here
EOF
    echo -e "${GREEN}Frontend .env.local template created. Please update with your actual values.${NC}"
}

# Setup Backend Environment
setup_backend() {
    echo -e "\n${BLUE}Setting up backend environment...${NC}"
    
    # Use project root venv if it exists, otherwise create one in backend
    if [ -d ".venv" ]; then
        echo "Using project root virtual environment..."
        VENV_DIR=".venv"
        VENV_PATH="../.venv"
    else
        echo "Creating backend-specific virtual environment..."
        cd backend
        if [ ! -d "venv" ]; then
            python3 -m venv venv
        fi
        VENV_DIR="venv"
        VENV_PATH="venv"
        cd ..
    fi

    # Activate virtual environment
    echo "Activating virtual environment..."
    source $VENV_DIR/bin/activate

    # Install backend dependencies
    echo "Installing backend dependencies..."
    cd backend
    pip install -r requirements.txt
    cd ..
    
    # Install ai-engine dependencies if they exist
    if [ -d "ai-engine" ] && [ -f "ai-engine/requirements.txt" ]; then
        echo "Installing AI engine dependencies..."
        cd ai-engine
        pip install -r requirements.txt
        cd ..
    elif [ -d "ai-engine" ]; then
        echo "AI engine directory exists but no requirements.txt found."
    fi

    # Deactivate virtual environment
    deactivate
    
    echo -e "${GREEN}Backend and AI engine setup complete!${NC}"
}

# Setup Frontend Environment
setup_frontend() {
    echo -e "\n${BLUE}Setting up frontend environment...${NC}"
    cd frontend

    # Install dependencies
    echo "Installing frontend dependencies..."
    npm install

    echo -e "${GREEN}Frontend setup complete!${NC}"
    cd ..
}

# Create run scripts
create_run_scripts() {
    echo -e "\n${BLUE}Creating run scripts...${NC}"
    
    # Determine virtual environment path
    if [ -d ".venv" ]; then
        VENV_PATH=".venv"
    else
        VENV_PATH="backend/venv"
    fi
    
    # Create start-backend script
    cat > start-backend.sh << EOF
#!/bin/bash
# ForexJoey Backend Startup Script
echo "🚀 Starting ForexJoey AI Backend..."

# Activate virtual environment
source ${VENV_PATH}/bin/activate

# Start the backend server
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Deactivate virtual environment on exit
deactivate
EOF
    chmod +x start-backend.sh
    
    # Create start-frontend script
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
# ForexJoey Frontend Startup Script
echo "🚀 Starting ForexJoey Frontend..."

cd frontend
npm run dev
EOF
    chmod +x start-frontend.sh
    
    # Create start-all script
    cat > start-all.sh << 'EOF'
#!/bin/bash
# ForexJoey Complete System Startup Script
echo "🚀 Starting ForexJoey (Backend + Frontend)..."

# Start backend in background
./start-backend.sh &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 3
echo "✅ Backend initialized (PID: $BACKEND_PID)"

# Start frontend in background
./start-frontend.sh &
FRONTEND_PID=$!
echo "✅ Frontend initialized (PID: $FRONTEND_PID)"

echo ""
echo "🤖 ForexJoey is running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:8000"
echo "⚡ Supabase Edge Functions are activated"
echo ""
echo "Press CTRL+C to stop all services"

# Trap CTRL+C to gracefully shut down all processes
trap "echo '\n🛑 Stopping all services...'; kill $BACKEND_PID $FRONTEND_PID; echo '✅ Stopped!'; exit" INT

# Wait for processes to finish
wait
EOF
    chmod +x start-all.sh
    
    echo -e "${GREEN}Run scripts created!${NC}"
}

# Add the path to shell configuration
setup_path() {
    echo -e "\n${BLUE}Setting up PATH for easy access...${NC}"
    PROJECT_DIR=$(pwd)
    SHELL_CONFIG=""
    
    # Detect shell
    if [[ "$SHELL" == *"zsh"* ]]; then
        SHELL_CONFIG="$HOME/.zshrc"
    elif [[ "$SHELL" == *"bash"* ]]; then
        SHELL_CONFIG="$HOME/.bashrc"
    else
        echo -e "${RED}Could not detect shell. Please add the following to your shell configuration manually:${NC}"
        echo -e "export PATH=\"$PROJECT_DIR:\$PATH\""
        return
    fi
    
    # Check if path already exists in config
    if grep -q "$PROJECT_DIR" "$SHELL_CONFIG"; then
        echo "Path already exists in $SHELL_CONFIG"
    else
        echo "Adding path to $SHELL_CONFIG"
        echo "# ForexJoey project path" >> "$SHELL_CONFIG"
        echo "export PATH=\"$PROJECT_DIR:\$PATH\"" >> "$SHELL_CONFIG"
    fi
    
    echo -e "${GREEN}PATH setup complete!${NC}"
    echo -e "${BLUE}Please run 'source $SHELL_CONFIG' to apply changes.${NC}"
}

# Create documentation
create_docs() {
    echo -e "\n${BLUE}Creating dependency management documentation...${NC}"
    
    cat > DEVELOPMENT.md << 'EOF'
# ForexJoey Development Guide

This guide explains how to work with the ForexJoey development environment, which consists of separate frontend and backend components.

## Initial Setup

Run the setup script to initialize both environments:

```bash
./setup.sh
```

## Running the Application

You can start both the frontend and backend with a single command:

```bash
./start-all.sh
```

Or run them separately:

```bash
./start-backend.sh
./start-frontend.sh
```

## Backend Development (Python)

The backend uses a Python virtual environment to isolate dependencies:

```bash
cd backend
source venv/bin/activate  # Activate the virtual environment
```

After making changes to dependencies:

```bash
pip install new-package
pip freeze > requirements.txt  # Update requirements file
```

To deactivate the virtual environment:

```bash
deactivate
```

## Frontend Development (Node.js)

The frontend uses npm for dependency management:

```bash
cd frontend
npm install  # Install dependencies
npm install --save new-package  # Add a new package
```

## Best Practices

1. Never mix dependencies between frontend and backend
2. Always use the virtual environment when working on the backend
3. Keep dependencies updated and security patches applied
4. Document new dependencies in the relevant README
5. For global tools, use pipx (Python) or npm global installs

## Troubleshooting

If you encounter dependency conflicts:

1. Backend: Recreate the virtual environment
   ```bash
   cd backend
   rm -rf venv
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. Frontend: Clear npm cache
   ```bash
   cd frontend
   rm -rf node_modules
   npm cache clean --force
   npm install
   ```
EOF
    
    echo -e "${GREEN}Documentation created: DEVELOPMENT.md${NC}"
}

# OANDA API verification function
verify_oanda_api() {
    echo -e "\n${BLUE}Verifying OANDA API configuration...${NC}"
    
    # Check if backend is set up with OANDA credentials
    local oanda_api_key=""
    local oanda_account_id=""
    
    if [ -f "backend/.env" ]; then
        # Extract OANDA API key and account ID
        oanda_api_key=$(grep OANDA_API_KEY backend/.env | cut -d= -f2)
        oanda_account_id=$(grep OANDA_ACCOUNT_ID backend/.env | cut -d= -f2)
    fi
    
    # Verify if values are set and not placeholders
    if [[ -z "$oanda_api_key" || "$oanda_api_key" == "your_oanda_api_key_here" || \
          -z "$oanda_account_id" || "$oanda_account_id" == "your_oanda_account_id_here" ]]; then
        echo -e "${YELLOW}⚠️ OANDA API configuration not found or incomplete.${NC}"
        echo -e "To enable full trading functionality, please set your OANDA API credentials in backend/.env:"
        echo -e "  OANDA_API_KEY=your_actual_api_key"
        echo -e "  OANDA_ACCOUNT_ID=your_actual_account_id"
        
        # Instructions for obtaining OANDA API credentials
        echo -e "\n${BLUE}How to get OANDA API credentials:${NC}"
        echo -e "1. Create an account at https://www.oanda.com/"
        echo -e "2. Go to 'My Account' > 'Manage API Access'"
        echo -e "3. Generate a new API token"
        echo -e "4. Your account ID is shown on your account dashboard"
        
        echo -e "\nForexJoey will run with limited functionality until OANDA API is configured."
        return 1
    else
        echo -e "${GREEN}✅ OANDA API configuration found!${NC}"
        return 0
    fi
}

# Function to verify multiple intelligence sources are available
verify_intelligence_sources() {
    echo -e "\n${BLUE}Verifying intelligence sources configuration...${NC}"
    local missing_sources=""
    
    # Read from backend .env file
    if [ -f "backend/.env" ]; then
        # Check required intelligence source APIs
        if ! grep -q "OPENAI_API_KEY=\(.\)\+" backend/.env || grep -q "OPENAI_API_KEY=your_" backend/.env; then
            missing_sources="$missing_sources\n  - OpenAI API (primary AI for signal generation)"
        fi
        
        if ! grep -q "NEWS_API_KEY=\(.\)\+" backend/.env || grep -q "NEWS_API_KEY=your_" backend/.env; then
            missing_sources="$missing_sources\n  - NewsAPI (sentiment analysis)"
        fi
        
        if ! grep -q "ALPHA_VANTAGE_API_KEY=\(.\)\+" backend/.env || grep -q "ALPHA_VANTAGE_API_KEY=your_" backend/.env; then
            missing_sources="$missing_sources\n  - Alpha Vantage (financial data)"
        fi
    else
        missing_sources="\n  - All intelligence sources (missing .env file)"
    fi
    
    if [ -n "$missing_sources" ]; then
        echo -e "${YELLOW}⚠️ Missing intelligence source configurations:${NC}$missing_sources"
        echo -e "\n${BLUE}ForexJoey requires at least 2 intelligence sources to generate high-accuracy trading signals.${NC}"
        echo -e "Please configure the missing API keys in backend/.env to enable full functionality."
        return 1
    else
        echo -e "${GREEN}✅ Intelligence sources configured!${NC}"
        return 0
    fi
}

# Main script execution
setup_backend
setup_frontend
create_run_scripts
setup_path
create_docs
check_environment_files

# Verify critical APIs
echo -e "\n${BLUE}Verifying critical APIs for ForexJoey's AI-first functionality...${NC}"
verify_oanda_api
OANDA_STATUS=$?
verify_intelligence_sources
INTELLIGENCE_STATUS=$?

echo -e "\n${GREEN}===================================================${NC}"
echo -e "${GREEN}  ForexJoey development environment setup complete!  ${NC}"
echo -e "${GREEN}===================================================${NC}"

# Summary of verification results
echo -e "\n${BLUE}Setup Summary:${NC}"
echo -e "- Environment: ${GREEN}✅ Configured${NC}"

if [ $OANDA_STATUS -eq 0 ]; then
    echo -e "- OANDA API: ${GREEN}✅ Verified${NC}"
else
    echo -e "- OANDA API: ${YELLOW}⚠️ Configuration needed${NC}"
fi

if [ $INTELLIGENCE_STATUS -eq 0 ]; then
    echo -e "- Intelligence Sources: ${GREEN}✅ All available${NC}"
else
    echo -e "- Intelligence Sources: ${YELLOW}⚠️ Some missing${NC}"
fi

echo -e "\nTo run the application:"
echo -e "- Backend: ${BLUE}./start-backend.sh${NC}"
echo -e "- Frontend: ${BLUE}./start-frontend.sh${NC}"
echo -e "- Both: ${BLUE}./start-all.sh${NC}"
echo -e "\nSee ${BLUE}DEVELOPMENT.md${NC} for more details on development workflow."
