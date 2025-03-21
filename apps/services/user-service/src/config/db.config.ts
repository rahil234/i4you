import mongoose from 'mongoose';
import {env} from "@/config";

export const connectDB = async () => {
    try {
        const CONNECTION_STRING = env.MONGODB_URI;
        console.log('Connecting to MongoDB:', CONNECTION_STRING);
        await mongoose.connect(CONNECTION_STRING);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
