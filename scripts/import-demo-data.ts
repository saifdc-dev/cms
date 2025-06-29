import 'dotenv/config';
import { supabase } from '../src/lib/supabase';

// Demo data
const demoCategories = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech trends, tutorials, and innovations',
    color: '#3B82F6'
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Business insights, strategies, and market analysis',
    color: '#10B981'
  },
  {
    name: 'Design',
    slug: 'design',
    description: 'UI/UX design, creative processes, and visual inspiration',
    color: '#8B5CF6'
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Personal development, health, and lifestyle content',
    color: '#F59E0B'
  },
  {
    name: 'Travel',
    slug: 'travel',
    description: 'Travel guides, experiences, and destination reviews',
    color: '#EF4444'
  }
];

const demoPosts = [
  {
    title: 'The Future of Web Development in 2024',
    slug: 'future-web-development-2024',
    content: `
# The Future of Web Development in 2024

Web development continues to evolve at a rapid pace. Here are the key trends shaping the industry:

## 1. AI-Powered Development Tools

Artificial Intelligence is revolutionizing how we write code. Tools like GitHub Copilot and ChatGPT are becoming essential parts of the developer workflow.

## 2. Edge Computing

Moving computation closer to users for better performance and reduced latency.

## 3. WebAssembly Growth

WebAssembly is enabling high-performance applications in the browser, opening new possibilities for web applications.

## 4. Serverless Architecture

Serverless continues to gain traction, allowing developers to focus on code rather than infrastructure.

## Conclusion

The future of web development is exciting, with new technologies making development faster and more efficient than ever before.
    `,
    excerpt: 'Explore the latest trends and technologies shaping web development in 2024, from AI-powered tools to edge computing.',
    status: 'published' as const,
    views: 1250,
    category_slug: 'technology'
  },
  {
    title: 'Building a Successful Remote Team',
    slug: 'building-successful-remote-team',
    content: `
# Building a Successful Remote Team

Remote work has become the new normal. Here's how to build and manage a successful remote team:

## Communication is Key

- Use the right tools for different types of communication
- Establish clear communication protocols
- Regular check-ins and team meetings

## Trust and Autonomy

- Focus on outcomes, not hours worked
- Give team members autonomy to manage their work
- Build trust through transparency

## Culture and Connection

- Create virtual spaces for informal interactions
- Celebrate achievements and milestones
- Invest in team building activities

## Tools and Technology

- Provide the right tools for collaboration
- Ensure everyone has reliable internet and equipment
- Regular training on new tools and processes

Building a remote team takes effort, but the benefits are worth it.
    `,
    excerpt: 'Learn the essential strategies for building and managing a successful remote team in today\'s distributed work environment.',
    status: 'published' as const,
    views: 890,
    category_slug: 'business'
  },
  {
    title: 'Design Systems: A Complete Guide',
    slug: 'design-systems-complete-guide',
    content: `
# Design Systems: A Complete Guide

A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build applications.

## What is a Design System?

A design system serves as a single source of truth for design and development teams, ensuring consistency across products.

## Key Components

1. **Design Tokens** - Colors, typography, spacing
2. **Component Library** - Reusable UI components
3. **Documentation** - Guidelines and usage examples
4. **Tools** - Design and development tools

## Benefits

- Consistency across products
- Faster development cycles
- Better collaboration between teams
- Easier maintenance and updates

## Getting Started

1. Audit your current designs
2. Define your design tokens
3. Build your component library
4. Document everything
5. Get team buy-in

A well-implemented design system can transform how your team works.
    `,
    excerpt: 'Everything you need to know about creating and implementing design systems for consistent, scalable user interfaces.',
    status: 'published' as const,
    views: 675,
    category_slug: 'design'
  },
  {
    title: 'The Art of Work-Life Balance',
    slug: 'art-work-life-balance',
    content: `
# The Art of Work-Life Balance

Achieving work-life balance is more important than ever in our always-connected world.

## Understanding Balance

Work-life balance doesn't mean equal time for work and personal life. It means having the flexibility to get things done in your professional life while still having time and energy for your personal life.

## Strategies for Better Balance

### Set Boundaries
- Define clear work hours
- Create a dedicated workspace
- Learn to say no to non-essential tasks

### Prioritize Self-Care
- Regular exercise and healthy eating
- Adequate sleep and rest
- Hobbies and personal interests

### Time Management
- Use productivity techniques like time blocking
- Eliminate or delegate non-essential tasks
- Focus on high-impact activities

## The Benefits

- Reduced stress and burnout
- Better physical and mental health
- Improved relationships
- Increased productivity and creativity

Remember, balance is personal and what works for others might not work for you.
    `,
    excerpt: 'Discover practical strategies for achieving better work-life balance and improving your overall well-being.',
    status: 'published' as const,
    views: 1120,
    category_slug: 'lifestyle'
  },
  {
    title: 'Hidden Gems of Southeast Asia',
    slug: 'hidden-gems-southeast-asia',
    content: `
# Hidden Gems of Southeast Asia

Southeast Asia is full of incredible destinations beyond the popular tourist spots. Here are some hidden gems worth exploring:

## 1. Koh Rong Sanloem, Cambodia

A pristine island with crystal-clear waters and untouched beaches. Perfect for those seeking tranquility away from crowds.

## 2. Siquijor Island, Philippines

Known for its mystical reputation, this island offers beautiful beaches, waterfalls, and a unique cultural experience.

## 3. Nusa Penida, Indonesia

While Bali gets all the attention, Nusa Penida offers dramatic cliffs, pristine beaches, and incredible snorkeling.

## 4. Kep, Cambodia

A charming coastal town famous for its crab market and pepper plantations. Great for a relaxing getaway.

## 5. Con Dao Islands, Vietnam

Former prison island turned paradise, with excellent diving and historical significance.

## Travel Tips

- Visit during shoulder seasons for better weather and fewer crowds
- Learn basic local phrases
- Respect local customs and traditions
- Pack light and bring reef-safe sunscreen

These destinations offer authentic experiences away from the tourist masses.
    `,
    excerpt: 'Discover amazing off-the-beaten-path destinations in Southeast Asia that offer authentic experiences and natural beauty.',
    status: 'published' as const,
    views: 945,
    category_slug: 'travel'
  },
  {
    title: 'Getting Started with TypeScript',
    slug: 'getting-started-typescript',
    content: `
# Getting Started with TypeScript

TypeScript is a powerful superset of JavaScript that adds static typing. Here's everything you need to know to get started.

## What is TypeScript?

TypeScript is developed by Microsoft and compiles to plain JavaScript. It helps catch errors early and makes code more maintainable.

## Key Benefits

- Static typing catches errors at compile time
- Better IDE support with autocomplete and refactoring
- Improved code documentation
- Easier refactoring of large codebases

## Basic Types

\`\`\`typescript
// Basic types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Objects
interface User {
  id: number;
  name: string;
  email: string;
}

let user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};
\`\`\`

## Getting Started

1. Install TypeScript: \`npm install -g typescript\`
2. Create a tsconfig.json file
3. Start writing TypeScript code
4. Compile with \`tsc\`

TypeScript has a learning curve, but the benefits are worth it for larger projects.
    `,
    excerpt: 'Learn the basics of TypeScript and how it can improve your JavaScript development experience.',
    status: 'draft' as const,
    views: 0,
    category_slug: 'technology'
  },
  {
    title: 'Sustainable Business Practices',
    slug: 'sustainable-business-practices',
    content: `
# Sustainable Business Practices

Sustainability is no longer optional for businesses. Here's how to implement sustainable practices that benefit both your company and the environment.

## Why Sustainability Matters

- Consumer demand for responsible businesses
- Cost savings through efficiency
- Regulatory compliance
- Employee satisfaction and retention
- Long-term business viability

## Key Areas to Focus On

### Energy Efficiency
- Switch to renewable energy sources
- Implement energy-efficient lighting and equipment
- Optimize heating and cooling systems

### Waste Reduction
- Implement recycling programs
- Reduce paper usage
- Choose sustainable packaging

### Supply Chain
- Work with sustainable suppliers
- Reduce transportation emissions
- Support local businesses

### Employee Engagement
- Educate employees about sustainability
- Encourage sustainable commuting
- Create green teams

## Measuring Success

- Track energy and water usage
- Monitor waste reduction
- Measure carbon footprint
- Survey employee satisfaction

Start small and gradually expand your sustainability efforts.
    `,
    excerpt: 'Learn how to implement sustainable business practices that benefit your company, employees, and the environment.',
    status: 'draft' as const,
    views: 0,
    category_slug: 'business'
  }
];

async function importDemoData() {
  console.log('🚀 Starting demo data import...');

  try {
    // Try to sign in with the demo admin user
    console.log('🔐 Attempting to sign in with demo admin user...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@dccms.com',
      password: 'admin123'
    });

    if (signInError) {
      console.error('❌ Error signing in admin user:', signInError.message);
      console.log('\n💡 The demo admin user has not been created yet.');
      console.log('Please run the backend seeding script first:');
      console.log('1. Navigate to the backend directory: cd backend');
      console.log('2. Run the seed script: npm run seed');
      console.log('3. Then run this demo data import script again');
      return;
    }

    const adminUserId = signInData.user?.id;

    if (!adminUserId) {
      console.error('❌ Could not get admin user ID');
      return;
    }

    console.log('✅ Successfully signed in as admin user');

    // Import categories
    console.log('📂 Importing categories...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .upsert(demoCategories, { onConflict: 'slug' })
      .select();

    if (categoriesError) {
      console.error('❌ Error importing categories:', categoriesError);
      return;
    }

    console.log(`✅ Imported ${categoriesData.length} categories`);

    // Create a mapping of category slugs to IDs
    const categoryMap = new Map();
    categoriesData.forEach(cat => {
      categoryMap.set(cat.slug, cat.id);
    });

    // Import posts
    console.log('📝 Importing posts...');
    const postsToInsert = demoPosts.map(post => ({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      views: post.views,
      author_id: adminUserId,
      category_id: categoryMap.get(post.category_slug),
      published_at: post.status === 'published' ? new Date().toISOString() : null
    }));

    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .upsert(postsToInsert, { onConflict: 'slug' })
      .select();

    if (postsError) {
      console.error('❌ Error importing posts:', postsError);
      return;
    }

    console.log(`✅ Imported ${postsData.length} posts`);

    console.log('🎉 Demo data import completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${categoriesData.length}`);
    console.log(`- Posts: ${postsData.length}`);
    console.log(`- Admin user: admin@dccms.com (password: admin123)`);

  } catch (error) {
    console.error('❌ Error during import:', error);
  }
}

// Run the import
importDemoData();