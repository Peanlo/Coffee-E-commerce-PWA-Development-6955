-- Create email_captures table for storing email addresses from discount campaigns
CREATE TABLE IF NOT EXISTS email_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  discount_code TEXT NOT NULL,
  campaign_type TEXT NOT NULL DEFAULT 'general',
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_captures_email ON email_captures(email);
CREATE INDEX IF NOT EXISTS idx_email_captures_campaign ON email_captures(campaign_type);
CREATE INDEX IF NOT EXISTS idx_email_captures_date ON email_captures(captured_at);

-- Enable RLS
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- Admin can view all email captures
CREATE POLICY "Admin can view all email captures" ON email_captures
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Admin can insert email captures (for manual entry)
CREATE POLICY "Admin can insert email captures" ON email_captures
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Public can insert their own email captures (for the forms)
CREATE POLICY "Public can insert email captures" ON email_captures
  FOR INSERT WITH CHECK (true);

-- Create a view for email capture statistics (admin only)
CREATE OR REPLACE VIEW email_capture_stats AS
SELECT 
  campaign_type,
  COUNT(*) as total_captures,
  COUNT(DISTINCT email) as unique_emails,
  DATE_TRUNC('day', captured_at) as capture_date
FROM email_captures 
GROUP BY campaign_type, DATE_TRUNC('day', captured_at)
ORDER BY capture_date DESC;

-- Grant access to the view for admins
GRANT SELECT ON email_capture_stats TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Admin can view email capture stats" ON email_capture_stats
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');