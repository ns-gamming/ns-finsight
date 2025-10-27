-- Add user profile fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url text;

-- Create orders table for tracking purchases
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  item_name text NOT NULL,
  category text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'INR',
  order_date timestamp with time zone NOT NULL DEFAULT now(),
  delivery_date timestamp with time zone,
  status text DEFAULT 'pending',
  tracking_number text,
  merchant text,
  notes text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own orders"
  ON orders
  FOR ALL
  USING (auth.uid() = user_id);

-- Create precious metals table (gold, silver, etc.)
CREATE TABLE IF NOT EXISTS precious_metals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  metal_type text NOT NULL, -- 'gold', 'silver', 'platinum', 'digital_gold'
  quantity numeric NOT NULL, -- in grams
  purchase_price numeric NOT NULL,
  current_price numeric,
  purchase_date date NOT NULL,
  provider text, -- 'bank', 'digital_platform', etc.
  currency text DEFAULT 'INR',
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE precious_metals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own precious metals"
  ON precious_metals
  FOR ALL
  USING (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL, -- 'savings', 'investment', 'budget', 'streak'
  achieved_at timestamp with time zone DEFAULT now(),
  milestone_value numeric,
  icon text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own achievements"
  ON achievements
  FOR ALL
  USING (auth.uid() = user_id);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  category text NOT NULL, -- 'feature_request', 'bug_report', 'general'
  title text NOT NULL,
  description text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  status text DEFAULT 'pending', -- 'pending', 'reviewed', 'implemented'
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback"
  ON feedback
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback"
  ON feedback
  FOR SELECT
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_date ON orders(user_id, order_date DESC);
CREATE INDEX IF NOT EXISTS idx_precious_metals_user ON precious_metals(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id, achieved_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status, created_at DESC);

-- Add triggers for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_precious_metals_updated_at
  BEFORE UPDATE ON precious_metals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();