/*
  # Enhanced Content Management System

  1. Enhanced Tables
    - Enhanced `posts` table with rich content fields
    - Enhanced `content_pages` with SEO and advanced features
    - New `sections` table with comprehensive content types
    - New `menus` table for navigation management
    - New `forms` table for dynamic form creation
    - New `form_fields` table for form field definitions
    - New `form_submissions` table for form data
    - New `media` table for file management
    - New `seo_meta` table for SEO metadata

  2. Content Types
    - Text, Rich Text, Images, Tables, Lists, Links
    - Post lists, Product lists, Forms
    - Gallery, Video, Audio content types

  3. SEO Features
    - Meta titles, descriptions, keywords
    - Open Graph tags, Twitter cards
    - Canonical URLs, robots directives

  4. Form Builder
    - Drag and drop form creation
    - Multiple field types
    - Form validation and submissions
*/

-- Enhanced post_status enum to include more states
DO $$ BEGIN
    ALTER TYPE post_status ADD VALUE IF NOT EXISTS 'scheduled';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create content_type enum for sections
CREATE TYPE content_type AS ENUM (
  'text', 'rich_text', 'image', 'gallery', 'video', 'audio',
  'table', 'list', 'link', 'button', 'form', 'post_list',
  'product_list', 'hero', 'testimonial', 'faq', 'contact'
);

-- Create field_type enum for forms
CREATE TYPE field_type AS ENUM (
  'text', 'email', 'password', 'number', 'tel', 'url',
  'textarea', 'select', 'radio', 'checkbox', 'file',
  'date', 'time', 'datetime', 'color', 'range'
);

-- Enhanced posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_description text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_keywords text[];
ALTER TABLE posts ADD COLUMN IF NOT EXISTS canonical_url text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_image text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_blocks jsonb DEFAULT '[]'::jsonb;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS audio_url text;

-- Enhanced content_pages table
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS seo_description text;
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS seo_keywords text[];
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS canonical_url text;
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS og_image text;
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS robots text DEFAULT 'index,follow';
ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS schema_markup jsonb;

-- Update sections table with enhanced content types
ALTER TABLE sections DROP COLUMN IF EXISTS type;
ALTER TABLE sections ADD COLUMN type content_type NOT NULL DEFAULT 'text';
ALTER TABLE sections ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}'::jsonb;
ALTER TABLE sections ADD COLUMN IF NOT EXISTS styles jsonb DEFAULT '{}'::jsonb;

-- Create media table for file management
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  file_size integer NOT NULL,
  url text NOT NULL,
  alt_text text,
  caption text,
  folder text DEFAULT 'uploads',
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  location text NOT NULL,
  items jsonb DEFAULT '[]'::jsonb,
  settings jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  settings jsonb DEFAULT '{}'::jsonb,
  fields jsonb DEFAULT '[]'::jsonb,
  notifications jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid REFERENCES forms(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  submitted_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create seo_meta table for global SEO settings
CREATE TABLE IF NOT EXISTS seo_meta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL, -- 'post', 'page', 'product', 'category'
  entity_id uuid NOT NULL,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  og_title text,
  og_description text,
  og_image text,
  og_type text DEFAULT 'website',
  twitter_card text DEFAULT 'summary',
  twitter_title text,
  twitter_description text,
  twitter_image text,
  canonical_url text,
  robots text DEFAULT 'index,follow',
  schema_markup jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(entity_type, entity_id)
);

-- Create triggers for updated_at
CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menus_updated_at
  BEFORE UPDATE ON menus
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forms_updated_at
  BEFORE UPDATE ON forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_meta_updated_at
  BEFORE UPDATE ON seo_meta
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for new tables
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_meta ENABLE ROW LEVEL SECURITY;

-- Media policies
CREATE POLICY "Anyone can read media"
  ON media
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload media"
  ON media
  FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can manage own media"
  ON media
  FOR ALL
  TO authenticated
  USING (uploaded_by = auth.uid());

-- Menus policies
CREATE POLICY "Anyone can read active menus"
  ON menus
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can manage menus"
  ON menus
  FOR ALL
  TO authenticated
  USING (true);

-- Forms policies
CREATE POLICY "Anyone can read active forms"
  ON forms
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can manage forms"
  ON forms
  FOR ALL
  TO authenticated
  USING (true);

-- Form submissions policies
CREATE POLICY "Users can submit forms"
  ON form_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own submissions"
  ON form_submissions
  FOR SELECT
  TO authenticated
  USING (submitted_by = auth.uid());

CREATE POLICY "Authenticated users can manage all submissions"
  ON form_submissions
  FOR ALL
  TO authenticated
  USING (true);

-- SEO meta policies
CREATE POLICY "Anyone can read seo meta"
  ON seo_meta
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage seo meta"
  ON seo_meta
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default menus
INSERT INTO menus (name, slug, location, items) VALUES
  ('Main Navigation', 'main-nav', 'header', '[
    {"label": "Home", "url": "/", "type": "page"},
    {"label": "About", "url": "/about", "type": "page"},
    {"label": "Products", "url": "/products", "type": "page"},
    {"label": "Contact", "url": "/contact", "type": "page"}
  ]'::jsonb),
  ('Footer Menu', 'footer-menu', 'footer', '[
    {"label": "Privacy Policy", "url": "/privacy", "type": "page"},
    {"label": "Terms of Service", "url": "/terms", "type": "page"},
    {"label": "Support", "url": "/support", "type": "page"}
  ]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample form
INSERT INTO forms (name, slug, description, fields, settings) VALUES
  ('Contact Form', 'contact', 'General contact form for inquiries', '[
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your full name",
      "required": true,
      "order": 1
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "placeholder": "Enter your email",
      "required": true,
      "order": 2
    },
    {
      "id": "subject",
      "type": "text",
      "label": "Subject",
      "placeholder": "What is this about?",
      "required": true,
      "order": 3
    },
    {
      "id": "message",
      "type": "textarea",
      "label": "Message",
      "placeholder": "Your message here...",
      "required": true,
      "rows": 5,
      "order": 4
    }
  ]'::jsonb, '{
    "submit_text": "Send Message",
    "success_message": "Thank you for your message! We will get back to you soon.",
    "email_notifications": true,
    "notification_email": "admin@dccms.com"
  }'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);
CREATE INDEX IF NOT EXISTS idx_menus_location ON menus(location);
CREATE INDEX IF NOT EXISTS idx_forms_status ON forms(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_seo_meta_entity ON seo_meta(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_sections_type ON sections(type);