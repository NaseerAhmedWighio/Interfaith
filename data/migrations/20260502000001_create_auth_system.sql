/*
  # Authentication System Schema

  1. New Tables
    - users: Core user accounts with authentication
    - sessions: Session management for logged-in users
    - role_requests: User requests for role upgrades
    - user_permissions: Granular permissions per user

  2. Security
    - Password hashing (bcrypt in application layer)
    - Email verification required
    - Token-based password reset
    - Session expiry management

  3. Relationships
    - Link existing tables to users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'editor', 'moderator', 'admin')),

  -- Email Verification
  email_verified BOOLEAN DEFAULT false,
  email_verification_token TEXT UNIQUE,
  email_verification_expires TIMESTAMPTZ,

  -- Password Reset
  password_reset_token TEXT UNIQUE,
  password_reset_expires TIMESTAMPTZ,

  -- Account Status
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Create role_requests table
CREATE TABLE IF NOT EXISTS role_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_role TEXT NOT NULL CHECK (requested_role IN ('editor', 'moderator')),
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),

  -- Admin Response
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for role_requests
CREATE INDEX IF NOT EXISTS idx_role_requests_user_id ON role_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_role_requests_status ON role_requests(status);
CREATE INDEX IF NOT EXISTS idx_role_requests_created_at ON role_requests(created_at DESC);

-- Create user_permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource TEXT NOT NULL, -- 'traditions', 'teachings', 'misconceptions', etc.
  actions TEXT[] DEFAULT '{}', -- ['read', 'create', 'update', 'delete']
  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, resource)
);

-- Create indexes for user_permissions
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_resource ON user_permissions(resource);

-- Add user_id to existing tables
ALTER TABLE movement_members ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
CREATE INDEX IF NOT EXISTS idx_movement_members_user_id ON movement_members(user_id);

ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_user_id ON newsletter_subscribers(user_id);

ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON assessment_results(user_id);

-- Enable RLS on new tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid()::uuid);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid()::uuid)
  WITH CHECK (id = auth.uid()::uuid);

-- RLS Policies for sessions table
CREATE POLICY "Users can read own sessions"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can delete own sessions"
  ON sessions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid()::uuid);

-- RLS Policies for role_requests table
CREATE POLICY "Users can read own role requests"
  ON role_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can create own role requests"
  ON role_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::uuid);

-- RLS Policies for user_permissions table
CREATE POLICY "Users can read own permissions"
  ON user_permissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::uuid);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_role_requests_updated_at
  BEFORE UPDATE ON role_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Create function to clean expired tokens
CREATE OR REPLACE FUNCTION clean_expired_tokens()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET
    email_verification_token = NULL,
    email_verification_expires = NULL
  WHERE email_verification_expires < now();

  UPDATE users
  SET
    password_reset_token = NULL,
    password_reset_expires = NULL
  WHERE password_reset_expires < now();
END;
$$ LANGUAGE plpgsql;
