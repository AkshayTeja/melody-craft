CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified TIMESTAMPTZ,
    image TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id VARCHAR(255) NOT NULL,
    provider_type VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ,
    token_type VARCHAR(255),
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    PRIMARY KEY (user_id, provider_id)
);

CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier VARCHAR(255) PRIMARY KEY,
    token TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_sessions (
    id SERIAL PRIMARY KEY,
    expires TIMESTAMPTZ NOT NULL,
    session_token TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS accounts_provider_id_idx ON accounts(provider_id);
CREATE INDEX IF NOT EXISTS accounts_provider_account_id_idx ON accounts(provider_account_id);
CREATE INDEX IF NOT EXISTS verification_tokens_identifier_idx ON verification_tokens(identifier);
CREATE INDEX IF NOT EXISTS sessions_session_token_idx ON auth_sessions(session_token);
