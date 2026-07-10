const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 4000
    });
    console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Atlas connection failed: ${error.message}. Fallback to Local MongoDB...`);
    try {
      const connLocal = await mongoose.connect('mongodb://localhost:27017/smart-waste', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 4000
      });
      console.log(`MongoDB Connected (Local): ${connLocal.connection.host}`);
    } catch (localError) {
      console.error(`Local MongoDB connection also failed: ${localError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
