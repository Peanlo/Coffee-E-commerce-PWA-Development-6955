-- Create support_conversations table for storing chatbot conversations
CREATE TABLE IF NOT EXISTS support_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  conversation_data JSONB NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_tickets table for formal support requests
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  order_id UUID REFERENCES orders(id),
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create support_ticket_messages table for ticket conversation history
CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_support_conversations_user ON support_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_support_conversations_category ON support_conversations(category);
CREATE INDEX IF NOT EXISTS idx_support_conversations_status ON support_conversations(status);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON support_tickets(category);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_order ON support_tickets(order_id);

CREATE INDEX IF NOT EXISTS idx_support_ticket_messages_ticket ON support_ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_ticket_messages_user ON support_ticket_messages(user_id);

-- Enable RLS
ALTER TABLE support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for support_conversations
CREATE POLICY "Users can view their own conversations" ON support_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON support_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON support_conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all conversations" ON support_conversations
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- RLS policies for support_tickets
CREATE POLICY "Users can view their own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" ON support_tickets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all tickets" ON support_tickets
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS policies for support_ticket_messages
CREATE POLICY "Users can view messages for their tickets" ON support_ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = support_ticket_messages.ticket_id 
      AND support_tickets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages for their tickets" ON support_ticket_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = support_ticket_messages.ticket_id 
      AND support_tickets.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all ticket messages" ON support_ticket_messages
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create a view for support statistics (admin only)
CREATE OR REPLACE VIEW support_statistics AS
SELECT 
  category,
  status,
  COUNT(*) as ticket_count,
  DATE_TRUNC('day', created_at) as date_created
FROM support_tickets 
GROUP BY category, status, DATE_TRUNC('day', created_at)
ORDER BY date_created DESC;

-- Grant access to the view for admins
GRANT SELECT ON support_statistics TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Admin can view support statistics" ON support_statistics
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_support_conversations_updated_at 
  BEFORE UPDATE ON support_conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at 
  BEFORE UPDATE ON support_tickets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();