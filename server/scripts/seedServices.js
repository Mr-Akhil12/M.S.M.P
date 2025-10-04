const mongoose = require('mongoose')
const Service = require('../src/models/service')  // Add /src/ to the path
require('dotenv').config()

const services = [
  {
    name: 'Spotify Premium',
    description: 'Unlimited music streaming with offline downloads.',
    category: 'Music',
    price: 49.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop&crop=center',
  },
  {
    name: 'Netflix Basic',
    description: 'Watch movies and TV shows in HD.',
    category: 'Entertainment',
    price: 99.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=200&fit=crop&crop=center',
  },
  {
    name: 'Showmax',
    description: 'South African streaming service with local content.',
    category: 'Entertainment',
    price: 79.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1489599735734-79b4d4c4b5b?w=400&h=200&fit=crop&crop=center',
  },
  {
    name: 'DSTV Compact',
    description: 'Satellite TV with 100+ channels.',
    category: 'TV',
    price: 299.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=200&fit=crop&crop=center',
  },
  {
    name: 'Xbox Game Pass',
    description: 'Access to 100+ games on Xbox.',
    category: 'Gaming',
    price: 149.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop&crop=center',
  },
  {
    name: 'News24 Premium',
    description: 'Ad-free news and analysis.',
    category: 'News',
    price: 29.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop&crop=center',
  },
  {
    name: 'SuperSport',
    description: 'Live sports streaming.',
    category: 'Sports',
    price: 199.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=200&fit=crop&crop=center',
  },
  {
    name: 'Audible',
    description: 'Audiobooks and podcasts.',
    category: 'Education',
    price: 59.99,
    billingCycle: 'monthly',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop&crop=center',
  },
]

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Update existing services or insert new ones
    for (const serviceData of services) {
      await Service.findOneAndUpdate(
        { name: serviceData.name }, // Find by name
        serviceData, // Update with new data
        { upsert: true, new: true } // Create if doesn't exist
      )
    }

    console.log('Services updated successfully')
  } catch (error) {
    console.error('Error seeding services:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Database connection closed')
  }
}

seedServices()