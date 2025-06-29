# DC CMS Backend

A production-grade Express.js backend for a headless CMS and ecommerce platform using Supabase (PostgreSQL).

## Features

### 🎯 Core Features
- **Dynamic Content Management**: Flexible content pages with nested sections
- **Full Ecommerce**: Products, variations, categories, orders, and order management
- **User Management**: JWT authentication with role-based access control
- **General Site Settings**: Dynamic configuration and site information
- **File Upload**: Secure file handling with validation

### 🚀 Bonus Features
- **Wishlists**: User product wishlists
- **Reviews**: Product reviews and ratings
- **Coupons**: Discount codes and promotions
- **Advanced Search**: Product filtering and pagination
- **API Documentation**: Swagger/OpenAPI documentation

### 🔒 Security Features
- JWT authentication
- Role-based access control (RBAC)
- Rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Row Level Security (RLS) with Supabase

## Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- PostgreSQL database (via Supabase)

### Installation

1. **Clone and install dependencies**
```bash
cd backend
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. **Database Setup**
```bash
# Run migrations (if using Supabase CLI)
# Or apply the migration files manually in Supabase dashboard

# Seed the database with demo data
npm run seed
```

4. **Start Development Server**
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=your_database_connection_string
DIRECT_URL=your_direct_database_connection_string

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_PATH=uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get all products (with filtering, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin/editor)
- `PUT /api/products/:id` - Update product (admin/editor)
- `DELETE /api/products/:id` - Delete product (admin/editor)

### Product Variations
- `GET /api/products/:productId/variations` - Get product variations
- `POST /api/products/variations` - Create variation (admin/editor)
- `PUT /api/products/variations/:id` - Update variation (admin/editor)
- `DELETE /api/products/variations/:id` - Delete variation (admin/editor)

### Order Endpoints
- `GET /api/orders` - Get orders (own orders for users, all for admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin/editor)
- `PUT /api/orders/:id/cancel` - Cancel order

### Category Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin/editor)
- `PUT /api/categories/:id` - Update category (admin/editor)
- `DELETE /api/categories/:id` - Delete category (admin/editor)

### Content Management Endpoints
- `GET /api/content` - Get all content pages
- `GET /api/content/:id` - Get content page by ID
- `GET /api/content/page/:htmlName` - Get content page by HTML name
- `POST /api/content` - Create content page (admin/editor/author)
- `PUT /api/content/:id` - Update content page (admin/editor/author)
- `DELETE /api/content/:id` - Delete content page (admin/editor)

### Settings Endpoints
- `GET /api/settings` - Get all settings
- `GET /api/settings/:key` - Get specific setting
- `PUT /api/settings/:key` - Update setting (admin)
- `PUT /api/settings` - Update multiple settings (admin)
- `DELETE /api/settings/:key` - Delete setting (admin)

### Site Information
- `GET /api/settings/site/info` - Get site information
- `PUT /api/settings/site/info` - Update site information (admin)

## Database Schema

### Core Tables
- **profiles** - User profiles with roles
- **categories** - Hierarchical product categories
- **products** - Product catalog
- **product_variations** - Product variants (size, color, etc.)
- **orders** - Customer orders
- **order_items** - Individual order line items
- **content_pages** - CMS pages
- **sections** - Page sections with flexible data
- **settings** - Application settings
- **site_info** - Site configuration

### Bonus Tables
- **wishlists** - User product wishlists
- **reviews** - Product reviews and ratings
- **coupons** - Discount codes

## Example API Requests

### Create a Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Awesome Product",
    "description": "This is an awesome product",
    "price": 99.99,
    "category_id": "category-uuid",
    "images": ["https://example.com/image1.jpg"],
    "status": "active"
  }'
```

### Create an Order
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {
        "product_id": "product-uuid",
        "variation_id": "variation-uuid",
        "quantity": 2,
        "unit_price": 99.99
      }
    ],
    "shipping_info": {
      "name": "John Doe",
      "address": "123 Main St",
      "city": "New York",
      "postal_code": "10001",
      "country": "USA",
      "phone": "+1234567890"
    }
  }'
```

### Create a Content Page
```bash
curl -X POST http://localhost:3001/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "About Us",
    "html_name": "about",
    "description": "Learn about our company",
    "sections": [
      {
        "type": "text",
        "order": 0,
        "data": {
          "content": "<h1>About Us</h1><p>We are awesome!</p>"
        }
      }
    ],
    "status": "published"
  }'
```

## User Roles

- **admin** - Full access to all features
- **editor** - Can manage products, orders, categories, and content
- **author** - Can create and manage own content pages
- **customer** - Can place orders, manage profile, and view content

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with demo data
- `npm run lint` - Run ESLint
- `npm run docs` - Generate API documentation

### Project Structure
```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   ├── scripts/         # Utility scripts (seeding, etc.)
│   └── server.ts        # Main server file
├── supabase/
│   └── migrations/      # Database migrations
├── uploads/             # File upload directory
└── README.md
```

## Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Set production environment variables**
```bash
export NODE_ENV=production
export JWT_SECRET=your-production-secret
# ... other production variables
```

3. **Start the server**
```bash
npm start
```

## API Documentation

When running in development mode, Swagger documentation is available at:
`http://localhost:3001/api-docs`

## Health Check

Check if the API is running:
`GET http://localhost:3001/health`

## Support

For issues and questions, please check the documentation or create an issue in the repository.