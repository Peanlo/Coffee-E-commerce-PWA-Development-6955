-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase DECIMAL(10,2),
  max_discount DECIMAL(10,2),
  usage_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coupon usage tracking table
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id),
  user_id UUID REFERENCES auth.users(id),
  order_id UUID REFERENCES orders(id),
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user ON coupon_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon ON coupon_usage(coupon_id);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for coupons
CREATE POLICY "Public can view active coupons" ON coupons
  FOR SELECT USING (active = true);

CREATE POLICY "Admin can manage coupons" ON coupons
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS policies for coupon usage
CREATE POLICY "Users can view their own coupon usage" ON coupon_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon usage" ON coupon_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all coupon usage" ON coupon_usage
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');