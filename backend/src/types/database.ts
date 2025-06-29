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
          parent_id?: string;
          created_at: string;
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
      content_pages: {
        Row: {
          id: string;
          title: string;
          html_name: string;
          description?: string;
          background_image?: string;
          background_color?: string;
          sections: any[];
          status: 'draft' | 'published' | 'archived';
          author_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          html_name: string;
          description?: string;
          background_image?: string;
          background_color?: string;
          sections?: any[];
          status?: 'draft' | 'published' | 'archived';
          author_id: string;
        };
        Update: {
          title?: string;
          html_name?: string;
          description?: string;
          background_image?: string;
          background_color?: string;
          sections?: any[];
          status?: 'draft' | 'published' | 'archived';
          updated_at?: string;
        };
      };
      sections: {
        Row: {
          id: string;
          content_page_id: string;
          type: string;
          order: number;
          data: any;
          created_at: string;
        };
        Insert: {
          content_page_id: string;
          type: string;
          order: number;
          data: any;
        };
        Update: {
          type?: string;
          order?: number;
          data?: any;
        };
      };
      products: {
        Row: {
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
        };
        Insert: {
          name: string;
          slug: string;
          description?: string;
          images?: string[];
          price: number;
          category_id?: string;
          status?: 'active' | 'inactive' | 'archived';
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          images?: string[];
          price?: number;
          category_id?: string;
          status?: 'active' | 'inactive' | 'archived';
          updated_at?: string;
        };
      };
      product_variations: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          options: any;
          price: number;
          stock: number;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          product_id: string;
          sku: string;
          options: any;
          price: number;
          stock: number;
          status?: 'active' | 'inactive';
        };
        Update: {
          sku?: string;
          options?: any;
          price?: number;
          stock?: number;
          status?: 'active' | 'inactive';
          updated_at?: string;
        };
      };
      orders: {
        Row: {
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
        };
        Insert: {
          user_id: string;
          order_number: string;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          items: any[];
          shipping_info: any;
          total_amount: number;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
        };
        Update: {
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          items?: any[];
          shipping_info?: any;
          total_amount?: number;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variation_id?: string;
          quantity: number;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          order_id: string;
          product_id: string;
          variation_id?: string;
          quantity: number;
          unit_price: number;
        };
        Update: {
          quantity?: number;
          unit_price?: number;
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: any;
          type: 'string' | 'number' | 'boolean' | 'json';
          description?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: any;
          type: 'string' | 'number' | 'boolean' | 'json';
          description?: string;
        };
        Update: {
          value?: any;
          type?: 'string' | 'number' | 'boolean' | 'json';
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
          social_icons: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          site_name: string;
          logo_url?: string;
          description?: string;
          contact_email?: string;
          phone?: string;
          address?: string;
          social_icons?: any[];
        };
        Update: {
          site_name?: string;
          logo_url?: string;
          description?: string;
          contact_email?: string;
          phone?: string;
          address?: string;
          social_icons?: any[];
          updated_at?: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
        };
        Update: {};
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          comment?: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          product_id: string;
          user_id: string;
          rating: number;
          comment?: string;
          status?: 'pending' | 'approved' | 'rejected';
        };
        Update: {
          rating?: number;
          comment?: string;
          status?: 'pending' | 'approved' | 'rejected';
          updated_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: 'percentage' | 'fixed';
          value: number;
          min_amount?: number;
          max_uses?: number;
          used_count: number;
          expires_at?: string;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          type: 'percentage' | 'fixed';
          value: number;
          min_amount?: number;
          max_uses?: number;
          expires_at?: string;
          status?: 'active' | 'inactive';
        };
        Update: {
          code?: string;
          type?: 'percentage' | 'fixed';
          value?: number;
          min_amount?: number;
          max_uses?: number;
          used_count?: number;
          expires_at?: string;
          status?: 'active' | 'inactive';
          updated_at?: string;
        };
      };
    };
    Views: {
      products_with_details: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          images: string[];
          price: number;
          category_id?: string;
          category_name?: string;
          status: 'active' | 'inactive' | 'archived';
          variations_count: number;
          average_rating: number;
          reviews_count: number;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}