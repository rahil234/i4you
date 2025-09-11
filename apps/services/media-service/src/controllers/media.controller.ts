import { inject, injectable } from 'inversify';
import { handleAsync } from '@/utils/handle-async';
import { TYPES } from '@/types';
import { IMediaService } from '@/services/interfaces/IMediaService';

@injectable()
export class MediaController {
  constructor(
    @inject(TYPES.MediaService) private mediaService: IMediaService
  ) {}

  getUploadUrl = handleAsync(async (req, res) => {
    const fileType = req.query.fileType as string;

    const uploadParams = await this.mediaService.generateUploadParams(
      req.user.id,
      fileType
    );

    res.status(200).json(uploadParams);
  });

  getImages = handleAsync(async (req, res) => {
    const { userId } = req.params;
    const images = await this.mediaService.getUserImages(userId);
    res.status(200).json({ images });
  });

  deleteImage = handleAsync(async (req, res) => {
    const { imageUrl } = req.params;
    const status = await this.mediaService.deleteImageByUrl(imageUrl);
    res.status(200).json({ message: 'Image deleted successfully', status });
  });
}
