export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'customer';
  avatar_url?: string;
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
  created_at: string;
}

export interface ContentPage {
  id: string;
  title: string;
  html_name: string;
  description?: string;
  background_image?: string;
  background_color?: string;
  sections: Section[];
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  content_page_id: string;
  type: string;
  order: number;
  data: any;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  price: number;
  category_id?: string;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  sku: string;
  options: any;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: any[];
  shipping_info: any;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variation_id?: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteInfo {
  id: string;
  site_name: string;
  logo_url?: string;
  description?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  social_icons: any[];
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface AuthRequest extends Request {
  user?: User;
}