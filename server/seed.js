const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Post = require('./models/Post');

dotenv.config();

const categories = [
  { name: 'Technology' },
  { name: 'Design' },
  { name: 'Development' },
  { name: 'Lifestyle' },
  { name: 'AI & Future' },
];

const posts = [
  {
    title: 'The Future of AI in Web Development',
    content: 'Artificial Intelligence is rapidly transforming the landscape of web development. From automated code generation to intelligent design systems, AI tools are empowering developers to build faster and smarter. In this post, we explore the latest trends and how you can leverage them in your projects.',
    categoryName: 'AI & Future',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: 'Mastering CSS Grid and Flexbox',
    content: 'CSS Grid and Flexbox are essential tools for modern web layout. While Flexbox is great for one-dimensional layouts, Grid shines in two-dimensional designs. Learn when to use which and how to combine them for responsive, robust user interfaces.',
    categoryName: 'Development',
    featuredImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: 'Minimalism in UI Design',
    content: 'Less is often more. Minimalist UI design focuses on simplicity, clarity, and functionality. By removing unnecessary elements, we can guide user attention to what truly matters. Discover the principles of minimalism and how to apply them effectively.',
    categoryName: 'Design',
    featuredImage: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: '10 Tips for a Balanced Lifestyle',
    content: 'In the fast-paced world of tech, maintaining a work-life balance is crucial. From time management techniques to mindfulness practices, here are 10 actionable tips to help you stay productive without burning out.',
    categoryName: 'Lifestyle',
    featuredImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: 'Understanding the MERN Stack',
    content: 'MongoDB, Express, React, and Node.js form the powerful MERN stack. This full-stack JavaScript solution allows for seamless development from front to back. We break down each component and show you how they work together to build dynamic web applications.',
    categoryName: 'Technology',
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Insert Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Map category names to IDs
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Prepare posts with category IDs
    const postsWithCategories = posts.map((post) => ({
      ...post,
      category: categoryMap[post.categoryName],
    }));

    // Insert Posts
    await Post.insertMany(postsWithCategories);
    console.log(`Created ${postsWithCategories.length} posts`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
