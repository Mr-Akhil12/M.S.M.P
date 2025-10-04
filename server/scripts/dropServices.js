const mongoose = require('mongoose')
require('dotenv').config()

async function dropServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
    
    await mongoose.connection.db.dropCollection('services')
    console.log('Services collection dropped')
  } catch (error) {
    console.error('Error dropping collection:', error)
  } finally {
    await mongoose.connection.close()
  }
}

dropServices()