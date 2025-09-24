export interface IModerationService {
  getPendingImages(
    status: 'approved' | 'pending' | 'rejected',
    sortBy?: string,
  ): Promise<any[]>;

  updateModerationStatus(publicId, status): Promise<any>;
}
