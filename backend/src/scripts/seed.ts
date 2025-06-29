import 'dotenv/config';
import { supabase } from '../config/database.js';

// Demo data
const demoCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    color: '#3B82F6'
  },
  {
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Mobile phones and accessories',
    color: '#8B5CF6',
    parent_slug: 'electronics'
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    description: 'Portable computers and accessories',
    color: '#10B981',
    parent_slug: 'electronics'
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel',
    color: '#F59E0B'
  },
  {
    name: 'Men\'s Clothing',
    slug: 'mens-clothing',
    description: 'Clothing for men',
    color: '#EF4444',
    parent_slug: 'clothing'
  },
  {
    name: 'Women\'s Clothing',
    slug: 'womens-clothing',
    description: 'Clothing for women',
    color: '#EC4899',
    parent_slug: 'clothing'
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement and garden supplies',
    color: '#84CC16'
  }
];

const demoProducts = [
  {
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    description: 'The latest iPhone with advanced features and powerful performance.',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'
    ],
    price: 999.99,
    category_slug: 'smartphones',
    status: 'active',
    variations: [
      {
        sku: 'IPHONE15PRO-128-BLUE',
        options: { storage: '128GB', color: 'Blue' },
        price: 999.99,
        stock: 50
      },
      {
        sku: 'IPHONE15PRO-256-BLUE',
        options: { storage: '256GB', color: 'Blue' },
        price: 1099.99,
        stock: 30
      },
      {
        sku: 'IPHONE15PRO-128-BLACK',
        options: { storage: '128GB', color: 'Black' },
        price: 999.99,
        stock: 45
      }
    ]
  },
  {
    name: 'MacBook Pro 16"',
    slug: 'macbook-pro-16',
    description: 'Professional laptop with M3 chip for demanding workflows.',
    images: [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg'
    ],
    price: 2499.99,
    category_slug: 'laptops',
    status: 'active',
    variations: [
      {
        sku: 'MBP16-M3-512-SILVER',
        options: { chip: 'M3', storage: '512GB', color: 'Silver' },
        price: 2499.99,
        stock: 20
      },
      {
        sku: 'MBP16-M3-1TB-SILVER',
        options: { chip: 'M3', storage: '1TB', color: 'Silver' },
        price: 2799.99,
        stock: 15
      }
    ]
  },
  {
    name: 'Classic Cotton T-Shirt',
    slug: 'classic-cotton-tshirt',
    description: 'Comfortable and stylish cotton t-shirt for everyday wear.',
    images: [
      'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg',
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
    ],
    price: 29.99,
    category_slug: 'mens-clothing',
    status: 'active',
    variations: [
      {
        sku: 'TSHIRT-M-WHITE',
        options: { size: 'M', color: 'White' },
        price: 29.99,
        stock: 100
      },
      {
        sku: 'TSHIRT-L-WHITE',
        options: { size: 'L', color: 'White' },
        price: 29.99,
        stock: 80
      },
      {
        sku: 'TSHIRT-M-BLACK',
        options: { size: 'M', color: 'Black' },
        price: 29.99,
        stock: 90
      }
    ]
  },
  {
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'High-quality wireless headphones with noise cancellation.',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'
    ],
    price: 199.99,
    category_slug: 'electronics',
    status: 'active',
    variations: [
      {
        sku: 'HEADPHONES-BLACK',
        options: { color: 'Black' },
        price: 199.99,
        stock: 60
      },
      {
        sku: 'HEADPHONES-WHITE',
        options: { color: 'White' },
        price: 199.99,
        stock: 40
      }
    ]
  },
  {
    name: 'Smart Home Security Camera',
    slug: 'smart-home-security-camera',
    description: 'WiFi-enabled security camera with night vision and mobile app.',
    images: [
      'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg'
    ],
    price: 149.99,
    category_slug: 'home-garden',
    status: 'active',
    variations: [
      {
        sku: 'CAMERA-INDOOR',
        options: { type: 'Indoor' },
        price: 149.99,
        stock: 35
      },
      {
        sku: 'CAMERA-OUTDOOR',
        options: { type: 'Outdoor' },
        price: 179.99,
        stock: 25
      }
    ]
  }
];

const demoContentPages = [
  {
    title: 'Welcome to Our Store',
    html_name: 'home',
    description: 'The homepage of our amazing ecommerce store',
    background_color: '#F8FAFC',
    sections: [
      {
        type: 'hero',
        order: 0,
        data: {
          title: 'Welcome to DC Store',
          subtitle: 'Discover amazing products at unbeatable prices',
          background_image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
          cta_text: 'Shop Now',
          cta_link: '/products'
        }
      },
      {
        type: 'featured_products',
        order: 1,
        data: {
          title: 'Featured Products',
          limit: 8
        }
      },
      {
        type: 'text',
        order: 2,
        data: {
          content: '<h2>Why Choose Us?</h2><p>We offer the best products with excellent customer service and fast shipping.</p>'
        }
      }
    ],
    status: 'published'
  },
  {
    title: 'About Us',
    html_name: 'about',
    description: 'Learn more about our company and mission',
    sections: [
      {
        type: 'text',
        order: 0,
        data: {
          content: '<h1>About DC Store</h1><p>We are a leading ecommerce platform dedicated to providing high-quality products and exceptional customer service.</p>'
        }
      },
      {
        type: 'image',
        order: 1,
        data: {
          src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
          alt: 'Our team',
          caption: 'Our dedicated team working hard for you'
        }
      }
    ],
    status: 'published'
  },
  {
    title: 'Contact Us',
    html_name: 'contact',
    description: 'Get in touch with our team',
    sections: [
      {
        type: 'text',
        order: 0,
        data: {
          content: '<h1>Contact Us</h1><p>We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.</p>'
        }
      },
      {
        type: 'contact_form',
        order: 1,
        data: {
          fields: ['name', 'email', 'subject', 'message']
        }
      }
    ],
    status: 'published'
  }
];

const demoCoupons = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    min_amount: 50,
    max_uses: 100,
    status: 'active'
  },
  {
    code: 'FREESHIP',
    type: 'fixed',
    value: 10,
    min_amount: 75,
    max_uses: 200,
    status: 'active'
  },
  {
    code: 'SAVE25',
    type: 'fixed',
    value: 25,
    min_amount: 100,
    max_uses: 50,
    status: 'active'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user if it doesn't exist
    console.log('👤 Creating admin user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@dccms.com',
      password: 'admin123',
      user_metadata: { username: 'admin', role: 'admin' }
    });

    if (authError && !authError.message.includes('already registered')) {
      console.error('❌ Error creating admin user:', authError);
      return;
    }

    let adminUserId = authData?.user?.id;

    // If user already exists, get their ID
    if (!adminUserId) {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', 'admin@dccms.com')
        .single();
      
      adminUserId = existingUser?.id;
    }

    if (!adminUserId) {
      console.error('❌ Could not get admin user ID');
      return;
    }

    console.log('✅ Admin user ready');

    // Seed categories
    console.log('📂 Seeding categories...');
    const categoryMap = new Map();
    
    // First pass: create parent categories
    for (const category of demoCategories.filter(c => !c.parent_slug)) {
      const { data, error } = await supabase
        .from('categories')
        .upsert({
          name: category.name,
          slug: category.slug,
          description: category.description,
          color: category.color
        }, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating category:', error);
        continue;
      }

      categoryMap.set(category.slug, data.id);
    }

    // Second pass: create child categories
    for (const category of demoCategories.filter(c => c.parent_slug)) {
      const parentId = categoryMap.get(category.parent_slug);
      
      const { data, error } = await supabase
        .from('categories')
        .upsert({
          name: category.name,
          slug: category.slug,
          description: category.description,
          color: category.color,
          parent_id: parentId
        }, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating category:', error);
        continue;
      }

      categoryMap.set(category.slug, data.id);
    }

    console.log(`✅ Seeded ${categoryMap.size} categories`);

    // Seed products
    console.log('📦 Seeding products...');
    let productCount = 0;
    let variationCount = 0;

    for (const product of demoProducts) {
      const categoryId = categoryMap.get(product.category_slug);
      
      const { data: productData, error: productError } = await supabase
        .from('products')
        .upsert({
          name: product.name,
          slug: product.slug,
          description: product.description,
          images: product.images,
          price: product.price,
          category_id: categoryId,
          status: product.status
        }, { onConflict: 'slug' })
        .select()
        .single();

      if (productError) {
        console.error('❌ Error creating product:', productError);
        continue;
      }

      productCount++;

      // Create product variations
      for (const variation of product.variations) {
        const { error: variationError } = await supabase
          .from('product_variations')
          .upsert({
            product_id: productData.id,
            sku: variation.sku,
            options: variation.options,
            price: variation.price,
            stock: variation.stock,
            status: 'active'
          }, { onConflict: 'sku' });

        if (variationError) {
          console.error('❌ Error creating variation:', variationError);
          continue;
        }

        variationCount++;
      }
    }

    console.log(`✅ Seeded ${productCount} products with ${variationCount} variations`);

    // Seed content pages
    console.log('📄 Seeding content pages...');
    let pageCount = 0;

    for (const page of demoContentPages) {
      const { data: pageData, error: pageError } = await supabase
        .from('content_pages')
        .upsert({
          title: page.title,
          html_name: page.html_name,
          description: page.description,
          background_color: page.background_color,
          sections: [],
          status: page.status,
          author_id: adminUserId
        }, { onConflict: 'html_name' })
        .select()
        .single();

      if (pageError) {
        console.error('❌ Error creating content page:', pageError);
        continue;
      }

      // Create sections
      for (const section of page.sections) {
        const { error: sectionError } = await supabase
          .from('sections')
          .upsert({
            content_page_id: pageData.id,
            type: section.type,
            order: section.order,
            data: section.data
          });

        if (sectionError) {
          console.error('❌ Error creating section:', sectionError);
        }
      }

      pageCount++;
    }

    console.log(`✅ Seeded ${pageCount} content pages`);

    // Seed coupons
    console.log('🎫 Seeding coupons...');
    const { data: couponsData, error: couponsError } = await supabase
      .from('coupons')
      .upsert(demoCoupons, { onConflict: 'code' })
      .select();

    if (couponsError) {
      console.error('❌ Error seeding coupons:', couponsError);
    } else {
      console.log(`✅ Seeded ${couponsData.length} coupons`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${categoryMap.size}`);
    console.log(`- Products: ${productCount}`);
    console.log(`- Product Variations: ${variationCount}`);
    console.log(`- Content Pages: ${pageCount}`);
    console.log(`- Coupons: ${couponsData?.length || 0}`);
    console.log(`- Admin user: admin@dccms.com (password: admin123)`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

// Run the seeding
seedDatabase();