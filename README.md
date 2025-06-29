# DC CMS - Advanced Content Management & Ecommerce System

A comprehensive, production-ready CMS and ecommerce platform built with React, TypeScript, and Supabase. Features a modern admin interface with full content management, product catalog, order management, and extensive customization options.

## 🚀 Features

### 📝 Content Management
- **Advanced Post Editor** - Rich content blocks, media gallery, SEO optimization
- **Dynamic Pages** - Flexible page builder with reusable sections
- **Category Management** - Hierarchical categories with custom colors
- **Media Library** - Organized file management with folders and metadata
- **Menu Builder** - Drag-and-drop navigation management
- **Form Builder** - Custom forms with validation and submissions

### 🛒 Ecommerce
- **Product Catalog** - Full product management with variations, specifications
- **Inventory Management** - Stock tracking, low stock alerts
- **Order Management** - Complete order lifecycle management
- **Customer Management** - User accounts, profiles, order history
- **Coupon System** - Discount codes and promotions
- **Reviews & Ratings** - Product reviews with moderation
- **Wishlist** - Customer wishlist functionality

### 👥 User Management
- **Role-Based Access** - Admin, Editor, Author, Customer roles
- **User Profiles** - Extended user information and preferences
- **Authentication** - Secure login/signup with Supabase Auth
- **Permission System** - Granular access control

### ⚙️ Advanced Settings
- **Site Configuration** - Logo, favicon, contact information
- **SEO & Analytics** - Google Analytics, Facebook Pixel, meta tags
- **Social Media** - Social platform integration
- **Branding** - Light/dark logos, custom styling
- **Maintenance Mode** - Site-wide maintenance with custom messages
- **Custom Code** - Head/footer code injection

### 🎨 Design & UX
- **Modern Interface** - Clean, intuitive admin dashboard
- **Dark Mode** - System/manual theme switching
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant interface
- **Performance** - Optimized for speed and efficiency

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify ready

## 📋 Prerequisites

- Node.js 18+
- Supabase account
- Modern web browser

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd dc-cms
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
Apply the migration files in your Supabase dashboard or use the Supabase CLI:
```bash
# If using Supabase CLI
supabase db push
```

### 4. Seed Demo Data
```bash
npm run import-demo
```

### 5. Start Development
```bash
npm run dev
```

Visit `http://localhost:5173` and login with:
- **Email**: admin@dccms.com
- **Password**: admin123

## 📊 Database Schema

### Core Tables
- **profiles** - User accounts with extended information
- **categories** - Hierarchical content/product categories
- **posts** - Blog posts with rich content blocks
- **content_pages** - Dynamic pages with sections
- **products** - Product catalog with variations
- **orders** - Ecommerce order management
- **media** - File management system
- **settings** - Site configuration
- **menus** - Navigation management
- **forms** - Custom form builder

### Advanced Features
- **Row Level Security (RLS)** - Secure data access
- **Real-time subscriptions** - Live updates
- **Full-text search** - Advanced search capabilities
- **Audit trails** - Change tracking
- **Soft deletes** - Data recovery options

## 🎯 User Roles & Permissions

### Admin
- Full system access
- User management
- Site settings
- All content operations

### Editor
- Content management
- Product management
- Order management
- User content moderation

### Author
- Create/edit own content
- Media library access
- Basic analytics

### Customer
- Account management
- Order history
- Wishlist management
- Reviews and ratings

## 🔧 Configuration

### Site Settings
Navigate to **Settings** in the admin panel to configure:

- **General**: Site name, timezone, user registration
- **Branding**: Logos, favicon, colors
- **Social Media**: Platform links and sharing
- **Ecommerce**: Currency, taxes, shipping
- **SEO**: Analytics, meta tags, tracking codes
- **Advanced**: Custom code injection

### Content Management
- **Posts**: Rich editor with blocks, SEO, scheduling
- **Pages**: Flexible page builder with sections
- **Media**: Organized file management
- **Menus**: Drag-and-drop navigation builder

### Ecommerce Setup
- **Products**: Catalog with variations and specifications
- **Orders**: Complete order lifecycle management
- **Customers**: User accounts and profiles
- **Settings**: Currency, taxes, shipping options

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔒 Security Features

- **Authentication** - Supabase Auth with JWT tokens
- **Authorization** - Role-based access control
- **Data Protection** - Row Level Security (RLS)
- **Input Validation** - Client and server-side validation
- **CORS Protection** - Configured for security
- **Rate Limiting** - API protection
- **Audit Logging** - User action tracking

## 📈 Performance

- **Code Splitting** - Lazy loading for optimal performance
- **Image Optimization** - Responsive images with lazy loading
- **Caching** - Intelligent caching strategies
- **Bundle Analysis** - Optimized build output
- **CDN Ready** - Static asset optimization

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run import-demo  # Import demo data
```

### Project Structure
```
src/
├── components/      # React components
├── contexts/        # React contexts
├── hooks/          # Custom hooks
├── lib/            # Utilities and configurations
├── types/          # TypeScript type definitions
└── styles/         # Global styles
```

### Adding New Features
1. Create component in `src/components/`
2. Add types in `src/types/`
3. Create hooks in `src/hooks/`
4. Update navigation in `src/components/Layout.tsx`

## 🐛 Troubleshooting

### Common Issues

**Authentication Errors**
- Verify Supabase URL and keys in `.env`
- Check RLS policies in Supabase dashboard
- Ensure user has proper role assigned

**Database Errors**
- Run latest migrations
- Check table permissions
- Verify foreign key constraints

**Build Errors**
- Clear node_modules and reinstall
- Check TypeScript errors
- Verify environment variables

### Getting Help
1. Check the console for error messages
2. Verify database schema matches types
3. Ensure all environment variables are set
4. Check Supabase dashboard for errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure
- **Tailwind CSS** - Styling framework
- **Lucide** - Icon library
- **React** - Frontend framework
- **TypeScript** - Type safety

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

---

**DC CMS** - Built for modern web applications with enterprise-grade features and developer-friendly architecture.