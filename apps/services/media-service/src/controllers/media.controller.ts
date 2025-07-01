import { injectable } from 'inversify';
import { handleAsync } from '@/utils/handle-async';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { env } from '@/config';

@injectable()
export class MediaController {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  getUploadUrl = handleAsync(async (req, res) => {
    console.log('Getting upload URL');

    const fileType = req.query.fileType as string;
    if (!fileType) {
      res.status(400).json({ message: 'Missing fileType in query' });
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `uploads/${uuidv4()}`;

    const paramsToSign = {
      timestamp,
      public_id: publicId,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      url: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
      fields: {
        ...paramsToSign,
        api_key: env.CLOUDINARY_API_KEY,
        signature,
      },
    });
  });
}
