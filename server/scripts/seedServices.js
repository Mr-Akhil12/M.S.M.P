const mongoose = require('mongoose');
const Service = require('../src/models/service');
require('dotenv').config();

const services = [
  {
    name: 'Spotify Premium',
    description: 'Unlimited music streaming with offline downloads.',
    category: 'Music',
    price: 49.99,
    billingCycle: 'monthly',
    imageUrl: 'https://via.placeholder.com/150?text=Spotify',
  },
  {
    name: 'Netflix Basic',
    description: 'Watch movies and TV shows in HD.',
    category: 'Entertainment',
    price: 99.99,
    billingCycle: 'monthly',
    imageUrl: 'https://via.placeholder.com/150?text=Netflix',
  },
  {
    name: 'Showmax',
    description: 'South African streaming service with local content.',
    category: 'Entertainment',
    price: 79.99,
    billingCycle: 'monthly',
    imageUrl: 'https://via.placeholder.com/150?text=Showmax',
  },
  {
    name: 'DSTV Compact',
    description: 'Satellite TV with 100+ channels.',
    category: 'TV',
    price: 299.99,
    billingCycle: 'monthly',
    imageUrl: 'https://via.placeholder.com/150?text=DSTV',
  },
  {
    name: 'Xbox Game Pass',
    description: 'Access to 100+ games on Xbox.',
    category: 'Gaming',
    price: 149.99,
    billingCycle: 'monthly',
    imageUrl: 'https://via.placeholder.com/150?text=Xbox',
  },
  {
    name: 'News24 Premium',
    description: 'Ad-free news and analysis.',
    category: 'News',
    price: 29.99,
    billingCycle: 'monthly',
    imageUrl: 'https://via.placeholder.com/150?text=News24',
  },
  {
    name: 'SuperSport',
    description: 'Live sports streaming.',
    category: 'Sports',
    price: 199.99,
    billingCycle: 'monthly',
    imageUrl: 'https://via.placeholder.com/150?text=SuperSport',
  },
  {
    name: 'Audible',
    description: 'Audiobooks and podcasts.',
    category: 'Education',
    price: 59.99,
    billingCycle: 'monthly',
    imageUrl: 'https://via.placeholder.com/150?text=Audible',
  },
];

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingServices = await Service.countDocuments();
    if (existingServices > 0) {
      console.log('Services already seeded');
      return;
    }

    await Service.insertMany(services);
    console.log('Services seeded successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedServices();