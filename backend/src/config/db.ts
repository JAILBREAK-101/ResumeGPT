import mongoose from 'mongoose';

export async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      console.log('MongoDB URI not provided, skipping connection');
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}