import { inject, injectable } from 'inversify';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { env } from '@/config';
import { SearchResponse, TYPES } from '@/types';
import ICacheService from '@/services/interfaces/ICacheService';

const blockedImageUrl =
  'https://res.cloudinary.com/snapcart-website/image/upload/v1754467019/content-blocked.jpg';

@injectable()
export class MediaService {
  constructor(@inject(TYPES.CacheService) private cacheService: ICacheService) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  async generateUploadParams(userId: string, fileType: string) {
    if (!fileType) {
      throw new Error('Missing fileType');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `uploads/${userId}/${uuidv4()}`;

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

    await this.cacheService.del(`user:images:${userId}`);

    return {
      url: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
      fields: {
        ...paramsToSign,
        api_key: env.CLOUDINARY_API_KEY,
        signature,
      },
    };
  }

  async getUserImages(userId: string) {
    const cacheKey = `user:images:${userId}`;

    const cachedImages = await this.cacheService.get<string[]>(cacheKey);
    if (cachedImages) {
      return cachedImages;
    }

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

    await this.cacheService.set(cacheKey, images, 900);

    return images;
  }

  async deleteImageByUrl(imageUrl: string) {
    if (!imageUrl) {
      throw new Error('Missing imageUrl');
    }

    const publicId =
      'uploads' + imageUrl.split('/uploads').pop()?.split('.')[0];

    const data = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      type: 'authenticated',
    });

    if (data.result !== 'ok') {
      throw new Error(`Failed to delete image: ${data.result}`);
    }

    const userIdFromUrl = publicId.split('/')[1];
    await this.cacheService.del(`user:images:${userIdFromUrl}`);

    return data.result;
  }
}
