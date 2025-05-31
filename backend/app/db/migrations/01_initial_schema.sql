-- Initial schema for ForexJoey Supabase database

-- Users table for authentication and profiles
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    full_name TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    subscription_tier TEXT NOT NULL DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ,
    signals_per_day INTEGER NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view and edit their own data" ON users
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Trading signals table
CREATE TABLE IF NOT EXISTS signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    currency_pair TEXT NOT NULL,
    direction TEXT NOT NULL,
    entry_price DECIMAL(10, 5) NOT NULL,
    stop_loss DECIMAL(10, 5) NOT NULL,
    take_profit DECIMAL(10, 5) NOT NULL,
    risk_reward_ratio DECIMAL(10, 2) NOT NULL,
    confidence_score DECIMAL(3, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    timeframe TEXT NOT NULL,
    expected_duration TEXT,
    analysis_summary TEXT,
    ai_reasoning TEXT,
    technical_factors JSONB,
    fundamental_factors JSONB,
    economic_events JSONB,
    sentiment_factors JSONB,
    intelligence_sources JSONB,
    current_price DECIMAL(10, 5),
    profit_loss_pips DECIMAL(10, 1),
    profit_loss_percentage DECIMAL(10, 4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- Add RLS policies for signals
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view and edit their own signals" ON signals
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Sentiment data table for caching sentiment analysis
CREATE TABLE IF NOT EXISTS sentiment_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    currency_pair TEXT NOT NULL,
    sentiment_score DECIMAL(3, 2) NOT NULL,
    confidence DECIMAL(3, 2) NOT NULL,
    direction TEXT NOT NULL,
    strength TEXT NOT NULL,
    news_count INTEGER NOT NULL,
    top_articles JSONB,
    explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for faster sentiment lookups
CREATE INDEX IF NOT EXISTS sentiment_data_currency_pair_idx ON sentiment_data(currency_pair);
CREATE INDEX IF NOT EXISTS sentiment_data_created_at_idx ON sentiment_data(created_at);

-- Signal outcomes table for AI reflection and learning
CREATE TABLE IF NOT EXISTS signal_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signal_id UUID REFERENCES signals(id) ON DELETE CASCADE,
    outcome_type TEXT NOT NULL, -- 'profit_target', 'stop_loss', 'manual_close', 'expired'
    price_at_close DECIMAL(10, 5),
    profit_loss_pips DECIMAL(10, 1),
    profit_loss_percentage DECIMAL(10, 4),
    duration_hours DECIMAL(10, 2),
    ai_reflection TEXT,
    factors_analysis JSONB,
    lessons_learned JSONB,
    accuracy_score DECIMAL(3, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies for signal outcomes
ALTER TABLE signal_outcomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own signal outcomes" ON signal_outcomes
    USING (auth.uid() = (SELECT user_id FROM signals WHERE id = signal_id));

-- User settings table for preferences and customization
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    theme TEXT NOT NULL DEFAULT 'dark',
    currency_pairs JSONB,
    notification_preferences JSONB,
    risk_profile TEXT NOT NULL DEFAULT 'moderate',
    auto_trade BOOLEAN NOT NULL DEFAULT FALSE,
    max_risk_per_trade DECIMAL(5, 2) NOT NULL DEFAULT 2.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies for user settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view and edit their own settings" ON user_settings
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add functions to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_signals_updated_at
BEFORE UPDATE ON signals
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_sentiment_data_updated_at
BEFORE UPDATE ON sentiment_data
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON user_settings
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
