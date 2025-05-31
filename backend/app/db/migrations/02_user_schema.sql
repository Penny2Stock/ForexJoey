-- Migration: 02_user_schema.sql
-- Description: Create user authentication and settings tables

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create user settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(50) NOT NULL DEFAULT 'dark',
    currency_pairs JSONB NOT NULL DEFAULT '["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"]',
    notification_preferences JSONB NOT NULL DEFAULT '{"email": true, "push": false}',
    risk_profile VARCHAR(50) NOT NULL DEFAULT 'moderate',
    auto_trade BOOLEAN NOT NULL DEFAULT FALSE,
    max_risk_per_trade NUMERIC(5,2) NOT NULL DEFAULT 2.0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create user trade history table
CREATE TABLE IF NOT EXISTS user_trade_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    signal_id UUID NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
    entry_price NUMERIC(10, 5) NOT NULL,
    exit_price NUMERIC(10, 5),
    direction VARCHAR(10) NOT NULL,
    size NUMERIC(10, 2) NOT NULL,
    profit_loss_pips NUMERIC(10, 2),
    profit_loss_percentage NUMERIC(10, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Create user api keys table
CREATE TABLE IF NOT EXISTS user_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    api_secret VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- Create user sessions table for WebSocket connections
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    last_active TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(session_token)
);

-- Create user notification table
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create AI performance metrics table
CREATE TABLE IF NOT EXISTS ai_performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    currency_pair VARCHAR(10) NOT NULL,
    timeframe VARCHAR(10) NOT NULL,
    total_signals INTEGER NOT NULL DEFAULT 0,
    accurate_signals INTEGER NOT NULL DEFAULT 0,
    accuracy_rate NUMERIC(5,4) NOT NULL DEFAULT 0,
    factor_weights JSONB NOT NULL DEFAULT '{"technical": 0.25, "fundamental": 0.25, "sentiment": 0.25, "economic": 0.25}',
    factor_accuracy JSONB NOT NULL DEFAULT '{"technical": 0.0, "fundamental": 0.0, "sentiment": 0.0, "economic": 0.0}',
    recent_signals JSONB NOT NULL DEFAULT '[]',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(currency_pair, timeframe)
);

-- Add audit triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON user_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_api_keys_updated_at
BEFORE UPDATE ON user_api_keys
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add indices for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_trade_history_user_id ON user_trade_history(user_id);
CREATE INDEX idx_user_trade_history_signal_id ON user_trade_history(signal_id);
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX idx_ai_performance_metrics_currency_pair ON ai_performance_metrics(currency_pair);
