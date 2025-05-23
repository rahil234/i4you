import mongoose from 'mongoose';
import { env } from '@/config';

export const connectDB = async () => {
  try {
    const MONGODB_URI = env.MONGODB_URI;
    console.log('Connecting to MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
