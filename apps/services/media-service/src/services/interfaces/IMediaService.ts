import { UploadParams } from '@/types';

export interface IMediaService {
  generateUploadParams(userId: string, fileType: string): Promise<UploadParams>;

  getUserImages(userId: string): Promise<string[]>;

  deleteImageByUrl(imageUrl: string): Promise<string>;
}
