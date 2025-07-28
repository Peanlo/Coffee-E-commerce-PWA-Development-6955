-- Create abandoned_cart_notifications table
CREATE TABLE IF NOT EXISTS abandoned_cart_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  cart_items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  recovery_token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  email_sent_at TIMESTAMP WITH TIME ZONE,
  recovered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_abandoned_cart_user ON abandoned_cart_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_cart_status ON abandoned_cart_notifications(status);
CREATE INDEX IF NOT EXISTS idx_abandoned_cart_token ON abandoned_cart_notifications(recovery_token);

-- Enable RLS
ALTER TABLE abandoned_cart_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own notifications" 
ON abandoned_cart_notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all notifications" 
ON abandoned_cart_notifications FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');