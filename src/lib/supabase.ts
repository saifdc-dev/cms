import { createClient } from '@supabase/supabase-js';

// Handle environment variables for both Vite (client-side) and Node.js (server-side)
const supabaseUrl = typeof import.meta !== 'undefined' && import.meta.env 
  ? import.meta.env.VITE_SUPABASE_URL 
  : process.env.VITE_SUPABASE_URL;

const supabaseAnonKey = typeof import.meta !== 'undefined' && import.meta.env 
  ? import.meta.env.VITE_SUPABASE_ANON_KEY 
  : process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          email: string;
          role: 'admin' | 'editor' | 'author' | 'customer';
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          role?: 'admin' | 'editor' | 'author' | 'customer';
          avatar_url?: string;
        };
        Update: {
          username?: string;
          email?: string;
          role?: 'admin' | 'editor' | 'author' | 'customer';
          avatar_url?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          color: string;
          created_at: string;
          parent_id?: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string;
          color?: string;
          parent_id?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          color?: string;
          parent_id?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content?: string;
          excerpt?: string;
          featured_image?: string;
          status: 'draft' | 'published' | 'archived' | 'scheduled';
          author_id?: string;
          category_id?: string;
          views: number;
          created_at: string;
          updated_at: string;
          published_at?: string;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string[];
          canonical_url?: string;
          og_image?: string;
          scheduled_at?: string;
          content_blocks?: any;
          gallery_images?: any;
          video_url?: string;
          audio_url?: string;
        };
        Insert: {
          title: string;
          slug: string;
          content?: string;
          excerpt?: string;
          featured_image?: string;
          status?: 'draft' | 'published' | 'archived' | 'scheduled';
          author_id?: string;
          category_id?: string;
          views?: number;
          published_at?: string;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string[];
          canonical_url?: string;
          og_image?: string;
          scheduled_at?: string;
          content_blocks?: any;
          gallery_images?: any;
          video_url?: string;
          audio_url?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          featured_image?: string;
          status?: 'draft' | 'published' | 'archived' | 'scheduled';
          category_id?: string;
          views?: number;
          updated_at?: string;
          published_at?: string;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string[];
          canonical_url?: string;
          og_image?: string;
          scheduled_at?: string;
          content_blocks?: any;
          gallery_images?: any;
          video_url?: string;
          audio_url?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          images?: any;
          price: number;
          category_id?: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string;
          images?: any;
          price: number;
          category_id?: string;
          status?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          images?: any;
          price?: number;
          category_id?: string;
          status?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id?: string;
          order_number: string;
          status: string;
          items: any;
          shipping_info: any;
          total_amount: number;
          payment_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string;
          order_number: string;
          status?: string;
          items: any;
          shipping_info: any;
          total_amount: number;
          payment_status?: string;
        };
        Update: {
          status?: string;
          items?: any;
          shipping_info?: any;
          total_amount?: number;
          payment_status?: string;
          updated_at?: string;
        };
      };
      content_pages: {
        Row: {
          id: string;
          title: string;
          html_name: string;
          description?: string;
          background_image?: string;
          background_color: string;
          sections?: any;
          status: 'draft' | 'published' | 'archived' | 'scheduled';
          author_id?: string;
          created_at: string;
          updated_at: string;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string[];
          canonical_url?: string;
          og_image?: string;
          robots: string;
          schema_markup?: any;
        };
        Insert: {
          title: string;
          html_name: string;
          description?: string;
          background_image?: string;
          background_color?: string;
          sections?: any;
          status?: 'draft' | 'published' | 'archived' | 'scheduled';
          author_id?: string;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string[];
          canonical_url?: string;
          og_image?: string;
          robots?: string;
          schema_markup?: any;
        };
        Update: {
          title?: string;
          html_name?: string;
          description?: string;
          background_image?: string;
          background_color?: string;
          sections?: any;
          status?: 'draft' | 'published' | 'archived' | 'scheduled';
          author_id?: string;
          updated_at?: string;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string[];
          canonical_url?: string;
          og_image?: string;
          robots?: string;
          schema_markup?: any;
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: any;
          type: string;
          description?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: any;
          type?: string;
          description?: string;
        };
        Update: {
          key?: string;
          value?: any;
          type?: string;
          description?: string;
          updated_at?: string;
        };
      };
      site_info: {
        Row: {
          id: string;
          site_name: string;
          logo_url?: string;
          description?: string;
          contact_email?: string;
          phone?: string;
          address?: string;
          social_icons?: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name: string;
          logo_url?: string;
          description?: string;
          contact_email?: string;
          phone?: string;
          address?: string;
          social_icons?: any;
        };
        Update: {
          site_name?: string;
          logo_url?: string;
          description?: string;
          contact_email?: string;
          phone?: string;
          address?: string;
          social_icons?: any;
          updated_at?: string;
        };
      };
    };
    Views: {
      posts_with_details: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content?: string;
          excerpt?: string;
          featured_image?: string;
          status: 'draft' | 'published' | 'archived' | 'scheduled';
          author_id: string;
          author_name: string;
          author_email: string;
          category_id?: string;
          category_name?: string;
          category_color?: string;
          views: number;
          created_at: string;
          updated_at: string;
          published_at?: string;
        };
      };
      products_with_details: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          images?: any;
          price: number;
          category_id?: string;
          status: string;
          created_at: string;
          updated_at: string;
          category_name?: string;
          variations_count: number;
          average_rating?: number;
          reviews_count: number;
        };
      };
    };
  };
}