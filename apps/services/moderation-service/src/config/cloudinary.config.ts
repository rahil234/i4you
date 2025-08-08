import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/config';

cloudinary.config({
  cloud_name: 'snapcart-website',
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export default cloudinary;