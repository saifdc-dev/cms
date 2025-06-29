-- Create additional tables for ecommerce and CMS

-- Extend user roles to include customer
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'customer';

-- Create content_pages table
CREATE TABLE IF NOT EXISTS content_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  html_name text UNIQUE NOT NULL,
  description text,
  background_image text,
  background_color text DEFAULT '#FFFFFF',
  sections jsonb DEFAULT '[]'::jsonb,
  status post_status DEFAULT 'draft',
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_page_id uuid REFERENCES content_pages(id) ON DELETE CASCADE,
  type text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Update categories table to support hierarchical structure
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id) ON DELETE SET NULL;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  images jsonb DEFAULT '[]'::jsonb,
  price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_variations table
CREATE TABLE IF NOT EXISTS product_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  sku text UNIQUE NOT NULL,
  options jsonb NOT NULL DEFAULT '{}'::jsonb,
  price decimal(10,2) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  shipping_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  total_amount decimal(10,2) NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variation_id uuid REFERENCES product_variations(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  type text DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_info table
CREATE TABLE IF NOT EXISTS site_info (
  id text PRIMARY KEY DEFAULT '1',
  site_name text NOT NULL,
  logo_url text,
  description text,
  contact_email text,
  phone text,
  address text,
  social_icons jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wishlists table (bonus feature)
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create reviews table (bonus feature)
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <=5),
  comment text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Create coupons table (bonus feature)
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value decimal(10,2) NOT NULL,
  min_amount decimal(10,2),
  max_uses integer,
  used_count integer DEFAULT 0,
  expires_at timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create triggers for updated_at
CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON content_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variations_updated_at
  BEFORE UPDATE ON product_variations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_info_updated_at
  BEFORE UPDATE ON site_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for products with details
CREATE OR REPLACE VIEW products_with_details AS
SELECT 
  p.*,
  c.name as category_name,
  COUNT(pv.id) as variations_count,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(r.id) as reviews_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_variations pv ON p.id = pv.product_id
LEFT JOIN reviews r ON p.id = r.product_id AND r.status = 'approved'
GROUP BY p.id, c.name;

-- Enable RLS for new tables
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Content pages policies
CREATE POLICY "Anyone can read published content pages"
  ON content_pages
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authors can manage own content pages"
  ON content_pages
  FOR ALL
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Editors and admins can manage all content pages"
  ON content_pages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Sections policies
CREATE POLICY "Anyone can read sections of published pages"
  ON sections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM content_pages
      WHERE id = sections.content_page_id AND status = 'published'
    )
  );

CREATE POLICY "Authors can manage sections of own pages"
  ON sections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_pages
      WHERE id = sections.content_page_id AND author_id = auth.uid()
    )
  );

CREATE POLICY "Editors and admins can manage all sections"
  ON sections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Products policies
CREATE POLICY "Anyone can read active products"
  ON products
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Editors and admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Product variations policies
CREATE POLICY "Anyone can read active product variations"
  ON product_variations
  FOR SELECT
  USING (
    status = 'active' AND
    EXISTS (
      SELECT 1 FROM products
      WHERE id = product_variations.product_id AND status = 'active'
    )
  );

CREATE POLICY "Editors and admins can manage product variations"
  ON product_variations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pending orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins and editors can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Order items policies
CREATE POLICY "Users can read own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_items.order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_items.order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and editors can manage all order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Settings policies
CREATE POLICY "Anyone can read settings"
  ON settings
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage settings"
  ON settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Site info policies
CREATE POLICY "Anyone can read site info"
  ON site_info
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage site info"
  ON site_info
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Wishlists policies
CREATE POLICY "Users can manage own wishlists"
  ON wishlists
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can read approved reviews"
  ON reviews
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can create own reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pending reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins and editors can manage all reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Coupons policies
CREATE POLICY "Anyone can read active coupons"
  ON coupons
  FOR SELECT
  USING (status = 'active' AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Only admins can manage coupons"
  ON coupons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create functions for stock management
CREATE OR REPLACE FUNCTION decrement_variation_stock(variation_id uuid, quantity integer)
RETURNS void AS $$
BEGIN
  UPDATE product_variations
  SET stock = stock - quantity
  WHERE id = variation_id AND stock >= quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for variation %', variation_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_variation_stock(variation_id uuid, quantity integer)
RETURNS void AS $$
BEGIN
  UPDATE product_variations
  SET stock = stock + quantity
  WHERE id = variation_id;
END;
$$ LANGUAGE plpgsql;

-- Insert default site info
INSERT INTO site_info (site_name, description) VALUES
  ('DC CMS', 'A modern headless CMS and ecommerce platform')
ON CONFLICT (id) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value, type, description) VALUES
  ('site_maintenance', 'false', 'boolean', 'Enable maintenance mode'),
  ('allow_registration', 'true', 'boolean', 'Allow user registration'),
  ('default_currency', '"USD"', 'string', 'Default currency code'),
  ('tax_rate', '0.08', 'number', 'Default tax rate'),
  ('shipping_cost', '10.00', 'number', 'Default shipping cost'),
  ('free_shipping_threshold', '100.00', 'number', 'Free shipping threshold'),
  ('max_order_items', '50', 'number', 'Maximum items per order'),
  ('email_notifications', 'true', 'boolean', 'Enable email notifications'),
  ('analytics_tracking_id', '""', 'string', 'Google Analytics tracking ID'),
  ('social_login_enabled', 'false', 'boolean', 'Enable social login')
ON CONFLICT (key) DO NOTHING;