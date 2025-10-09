const mongoose = require('mongoose');
const Service = require('../src/models/Service');
require('dotenv').config();

const services = [
  {
    name: 'Spotify Premium',
    description: 'Unlimited music streaming with offline downloads.',
    category: 'entertainment',
    price: 49.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
    isActive: true
  },
  {
    name: 'Netflix Basic',
    description: 'Watch movies and TV shows in HD.',
    category: 'entertainment',
    price: 99.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=200&fit=crop',
    isActive: true
  },
  {
    name: 'Showmax',
    description: 'South African streaming service with local content.',
    category: 'entertainment',
    price: 79.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=200&fit=crop',
    isActive: true
  },
  {
    name: 'DSTV Compact',
    description: 'Satellite TV with 100+ channels.',
    category: 'entertainment',
    price: 299.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=200&fit=crop',
    isActive: true
  },
  {
    name: 'Xbox Game Pass',
    description: 'Access to 100+ games on Xbox.',
    category: 'entertainment',
    price: 149.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
    isActive: true
  },
  {
    name: 'News24 Premium',
    description: 'Ad-free news and analysis.',
    category: 'news',
    price: 29.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop',
    isActive: true
  },
  {
    name: 'SuperSport',
    description: 'Live sports streaming.',
    category: 'entertainment',
    price: 199.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=200&fit=crop',
    isActive: true
  },
  {
    name: 'Audible',
    description: 'Audiobooks and podcasts.',
    category: 'education',
    price: 59.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop',
    isActive: true
  }
];

/**
 * Seed database with services
 * Updates existing services or creates new ones
 */
async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[SEED] Connected to MongoDB');

    for (const serviceData of services) {
      await Service.findOneAndUpdate(
        { name: serviceData.name },
        serviceData,
        { upsert: true, new: true }
      );
    }

    console.log(`[SEED] ${services.length} services seeded successfully`);
  } catch (error) {
    console.error('[SEED] Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('[SEED] Database connection closed');
  }
}

seedServices();