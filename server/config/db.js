const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // If MONGO_URI is not set, use in-memory MongoDB for development
    if (!process.env.MONGO_URI || process.env.MONGO_URI === 'memory') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      console.log('🧪 Using in-memory MongoDB for development');
      console.log(`   URI: ${uri}`);
      
      await mongoose.connect(uri);
      console.log('✅ In-memory MongoDB connected');
      
      // Auto-seed when using in-memory DB
      const seed = require('../seed');
      await seed();
      
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
