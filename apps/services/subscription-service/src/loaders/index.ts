import {connectDB} from '@/config/db.config';

export const initLoaders = async () => {
    await connectDB();
};
