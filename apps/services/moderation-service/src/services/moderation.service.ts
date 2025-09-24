import { injectable } from 'inversify';
import cloudinary from '@/config/cloudinary.config';
import { IModerationService } from '@/services/interfaces/IModerationService';

@injectable()
export class ModerationService implements IModerationService {
  getPendingImages = async (status: 'approved' | 'pending' | 'rejected') => {
    const result = await cloudinary.search
      .expression(`moderation_status:${status}`)
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();

    return result.resources.map((resource) => ({
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

  updateModerationStatus = async (publicId: string, status: string) => {
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
