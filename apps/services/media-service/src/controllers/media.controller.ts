import { injectable } from 'inversify';
import { handleAsync } from '@/utils/handle-async';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { env } from '@/config';

interface SearchResponseImage {
  asset_id: string;
  public_id: string;
  asset_folder: string;
  filename: string;
  display_name: string;
  format: 'jpg' | 'png';
  version: number;
  resource_type: 'image';
  type: 'authenticated';
  created_at: Date;
  uploaded_at: Date;
  bytes: number;
  backup_bytes: number;
  width: number;
  height: number;
  aspect_ratio: number;
  pixels: number;
  url: string;
  secure_url: string;
  status: 'active' | 'pending';
  moderation_kind: 'manual' | 'auto';
  moderation_status: 'pending' | 'approved' | 'rejected';
  access_mode: 'public';
  access_control: null;
  etag: string;
  created_by: [object];
  uploaded_by: [object];
}

interface SearchResponse {
  resources: SearchResponseImage[];
}

const blockedImageUrl =
  'https://res.cloudinary.com/snapcart-website/image/upload/v1754467019/content-blocked.jpg';

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
    const fileType = req.query.fileType as string;
    if (!fileType) {
      res.status(400).json({ message: 'Missing fileType in query' });
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const publicId = `uploads/${req.user.id}/${uuidv4()}`;

    const paramsToSign = {
      timestamp,
      public_id: publicId,
      moderation: 'manual',
      type: 'authenticated',
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

  getImages = handleAsync(async (req, res) => {
    const { userId } = req.params;
    const publicId = `uploads/${userId}`;

    const response = (await cloudinary.search
      .expression(
        `public_id:${publicId}/* AND (moderation_status:approved OR moderation_status:pending OR moderation_status:rejected)`
      )
      .sort_by('created_at', 'asc')
      .execute()) as SearchResponse;

    const images = response.resources.map((image) =>
      image.moderation_status === 'rejected'
        ? blockedImageUrl
        : image.secure_url
    );

    res.status(200).json({ images });
  });

  deleteImage = handleAsync(async (req, res) => {
    const { imageUrl } = req.params;
    if (!imageUrl) {
      res.status(400).json({ message: 'Missing publicId in parameters' });
      return;
    }

    const publicId =
      'uploads' + imageUrl.split('/uploads').pop()?.split('.')[0];

    const data = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      type: 'authenticated',
    });

    if (data.result !== 'ok') {
      console.error(`Failed to delete image: ${data.result}`);
      res
        .status(500)
        .json({ message: 'Failed to delete image', error: data.result });
      return;
    }

    res
      .status(200)
      .json({ message: 'Image deleted successfully', status: data.result });
  });
}
