import { inject, injectable } from 'inversify';
import cloudinary from '@/config/cloudinary.config';
import { TYPES } from '@/types';
import IModerationRepository from '@/repositories/interfaces/IModerationRepository';

@injectable()
export class ModerationService {
  constructor(@inject(TYPES.ModerationRepository) private moderationRepository: IModerationRepository) {
  }

  getPendingImages = async (status: 'approved' | 'pending' | 'rejected', sortBy?: string) => {
    const result = await cloudinary.search
      .expression(`moderation_status:${status}`)
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();

    return result.resources.map((resource: any) => ({
      id: resource.asset_id,
      publicId: resource.public_id,
      date: new Date(resource.created_at).toLocaleString(),
      image: cloudinary.url(resource.public_id, {
        type: 'authenticated',
        sign_url: true,
        secure: true,
      }),
      status: resource.moderation_status,
    }));
  };

  updateModerationStatus = async (publicId, status) => {
    const result = await cloudinary.api.update(publicId, {
      moderation_status: status,
      type: 'authenticated',
    });

    return {
      publicId: result.public_id,
      moderationStatus: result.moderation,
    };
  };
}
