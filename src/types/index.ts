export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'customer';
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: any;
  status: 'active' | 'inactive' | 'suspended';
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  parent_id?: string;
  image?: string;
  meta_title?: string;
  meta_description?: string;
  sort_order?: number;
  is_featured?: boolean;
  post_count?: number;
  product_count?: number;
  created_at: string;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'rich_text' | 'image' | 'gallery' | 'video' | 'audio' | 'table' | 'list' | 'link' | 'button' | 'form' | 'post_list' | 'product_list' | 'hero' | 'testimonial' | 'faq' | 'contact' | 'spacer' | 'divider' | 'code' | 'quote' | 'blockquote';
  content: any;
  order: number;
  settings?: any;
  styles?: any;
}

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  content_blocks?: ContentBlock[];
  type: 'banner' | 'gallery' | 'child_page' | 'section' | 'slider' | 'video' | 'image';
  order: number;
}

export interface PostSection {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  content_blocks?: ContentBlock[];
  type: 'banner' | 'gallery' | 'child_page' | 'section' | 'slider' | 'video' | 'image';
  post_list?: PostListItem[];
  order: number;
}

export interface SEOData {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  robots?: string;
  schema_markup?: any;
  focus_keyword?: string;
  readability_score?: number;
}

export interface Post extends SEOData {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  author_id: string;
  author_name?: string;
  author_email?: string;
  category_id?: string;
  category_name?: string;
  category_color?: string;
  tags?: string[];
  views: number;
  likes?: number;
  comments_count?: number;
  reading_time?: number;
  content_blocks?: ContentBlock[];
  sections?: PostSection[];
  gallery_images?: string[];
  video_url?: string;
  audio_url?: string;
  scheduled_at?: string;
  is_featured?: boolean;
  allow_comments?: boolean;
  template?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ContentPage extends SEOData {
  id: string;
  title: string;
  html_name: string;
  description?: string;
  background_image?: string;
  background_color?: string;
  sections?: Section[];
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  template?: string;
  is_homepage?: boolean;
  parent_id?: string;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  content_page_id: string;
  type: 'text' | 'rich_text' | 'image' | 'gallery' | 'video' | 'audio' | 'table' | 'list' | 'link' | 'button' | 'form' | 'post_list' | 'product_list' | 'hero' | 'testimonial' | 'faq' | 'contact';
  order: number;
  data: any;
  settings?: any;
  styles?: any;
  created_at: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  slug: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date' | 'color';
  values?: string[];
  is_required?: boolean;
  is_variation?: boolean;
  sort_order?: number;
}

export interface ProductSpecification {
  attribute_id: string;
  attribute_name: string;
  value: string;
}

export interface Product extends SEOData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  images: string[];
  gallery_images?: string[];
  price: number;
  sale_price?: number;
  cost_price?: number;
  sku?: string;
  stock_quantity?: number;
  manage_stock?: boolean;
  stock_status: 'in_stock' | 'out_of_stock' | 'on_backorder';
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  category_id?: string;
  category_name?: string;
  brand?: string;
  tags?: string[];
  status: 'active' | 'inactive' | 'archived';
  type: 'simple' | 'variable' | 'grouped' | 'external';
  featured?: boolean;
  virtual?: boolean;
  downloadable?: boolean;
  download_files?: any[];
  specifications?: ProductSpecification[];
  at_a_glance?: string[];
  variations_count?: number;
  average_rating?: number;
  reviews_count?: number;
  total_sales?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  sku: string;
  attributes: any;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  manage_stock?: boolean;
  stock_status: 'in_stock' | 'out_of_stock' | 'on_backorder';
  weight?: number;
  dimensions?: any;
  image?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  user?: {
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'on_hold';
  currency: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  transaction_id?: string;
  billing_address: any;
  shipping_address: any;
  items: OrderItem[];
  notes?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variation_id?: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_data?: any;
  created_at: string;
}

export interface Media {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  url: string;
  alt_text?: string;
  caption?: string;
  description?: string;
  folder: string;
  width?: number;
  height?: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface Gallery {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'image' | 'video' | 'mixed';
  images: string[];
  settings?: any;
  status: 'active' | 'inactive';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: string;
  name: string;
  slug: string;
  location: string;
  items: MenuItem[];
  settings?: any;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id?: string;
  label: string;
  url: string;
  type: 'page' | 'post' | 'product' | 'category' | 'custom';
  target?: '_blank' | '_self';
  icon?: string;
  css_class?: string;
  children?: MenuItem[];
  order?: number;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'date' | 'time' | 'datetime' | 'color' | 'range';
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: any;
  order: number;
  settings?: any;
  css_class?: string;
}

export interface Form {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: FormField[];
  settings?: any;
  notifications?: any;
  success_message?: string;
  redirect_url?: string;
  status: 'active' | 'inactive';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  data: any;
  ip_address?: string;
  user_agent?: string;
  submitted_by?: string;
  status: 'unread' | 'read' | 'replied' | 'spam';
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'text' | 'image' | 'color';
  description?: string;
  group?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteInfo {
  id: string;
  site_name: string;
  tagline?: string;
  logo_light?: string;
  logo_dark?: string;
  favicon?: string;
  description?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  social_icons: SocialIcon[];
  copyright_text?: string;
  google_analytics?: string;
  facebook_pixel?: string;
  google_tag_manager?: string;
  custom_head_code?: string;
  custom_footer_code?: string;
  maintenance_mode?: boolean;
  maintenance_message?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialIcon {
  platform: string;
  url: string;
  icon: string;
  order?: number;
}

export interface AuthState {
  user: User | null;
  session: any;
  isAuthenticated: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  limit: number;
  offset: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user?: {
    username: string;
  };
  product?: {
    name: string;
  };
  rating: number;
  title?: string;
  comment?: string;
  status: 'pending' | 'approved' | 'rejected';
  helpful_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_cart' | 'fixed_product';
  amount: number;
  description?: string;
  minimum_amount?: number;
  maximum_amount?: number;
  usage_limit?: number;
  usage_limit_per_user?: number;
  used_count: number;
  expires_at?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  items: CartItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variation_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_data?: any;
}