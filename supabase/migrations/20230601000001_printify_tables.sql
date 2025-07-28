-- Create app_settings table for storing Printify API credentials
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Printify product IDs to products table
ALTER TABLE products_cogli234 ADD COLUMN IF NOT EXISTS printify_product_id TEXT;
ALTER TABLE products_cogli234 ADD COLUMN IF NOT EXISTS printify_data JSONB;

-- Add Printify order ID to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS printify_order_id TEXT;

-- Add Printify product IDs to order_items table
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS printify_product_id TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS printify_variant_id INTEGER;

-- Create printify_orders table to track Printify orders
CREATE TABLE IF NOT EXISTS printify_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  printify_order_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create printify_shipping table to track shipping information
CREATE TABLE IF NOT EXISTS printify_shipping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  printify_order_id TEXT NOT NULL,
  carrier TEXT,
  service TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_printify_id ON products_cogli234(printify_product_id);
CREATE INDEX IF NOT EXISTS idx_orders_printify_id ON orders(printify_order_id);
CREATE INDEX IF NOT EXISTS idx_printify_orders_order_id ON printify_orders(printify_order_id);
CREATE INDEX IF NOT EXISTS idx_printify_shipping_order_id ON printify_shipping(printify_order_id);

-- Add RLS policies
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE printify_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE printify_shipping ENABLE ROW LEVEL SECURITY;

-- Admin only policies for app_settings
CREATE POLICY "Admin can read app settings" ON app_settings
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
  
CREATE POLICY "Admin can insert app settings" ON app_settings
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
  
CREATE POLICY "Admin can update app settings" ON app_settings
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Admin only policies for printify_orders
CREATE POLICY "Admin can read printify orders" ON printify_orders
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
  
CREATE POLICY "Admin can insert printify orders" ON printify_orders
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
  
CREATE POLICY "Admin can update printify orders" ON printify_orders
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Public shipping info but only for orders the user owns
CREATE POLICY "Users can view their shipping info" ON printify_shipping
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.printify_order_id = printify_shipping.printify_order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admin can manage shipping info
CREATE POLICY "Admin can manage shipping info" ON printify_shipping
  USING (auth.jwt() ->> 'role' = 'admin');