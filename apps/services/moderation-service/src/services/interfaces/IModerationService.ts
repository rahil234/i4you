import { ModerationImage, ModerationStatus } from '@/types';

export interface IModerationService {
  getPendingImages(
    status: 'approved' | 'pending' | 'rejected',
    sortBy?: string,
  ): Promise<ModerationImage[]>;

  updateModerationStatus(
    publicId: string,
    status: ModerationStatus,
  ): Promise<any>;
}
