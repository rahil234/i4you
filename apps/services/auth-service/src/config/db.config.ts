import mongoose from 'mongoose';
import { env } from '@/config';

export const connectDB = async () => {
  try {
    const MONGODB_URI = new URL(
      env.MONGODB_URI.concat(
        '/I4You-userDB',
        '?retryWrites=true&w=majority&appName=i4you-cluster'
      )
    );

    console.log('Connecting to MongoDB:', MONGODB_URI.host);
    await mongoose.connect(MONGODB_URI.toString());
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
