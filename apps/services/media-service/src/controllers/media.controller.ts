import { inject, injectable } from 'inversify';
import { handleAsync } from '@/utils/handle-async';
import { TYPES } from '@/types';
import { IMediaService } from '@/services/interfaces/IMediaService';
import { HTTP_STATUS } from '@/constants/http-status.constant';
import { MEDIA_MESSAGES } from '@/constants/response-messages.constant';

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

    res.status(HTTP_STATUS.OK).json({
      statusCode: HTTP_STATUS.OK,
      message: MEDIA_MESSAGES.UPLOAD_URL_SUCCESS,
      data: uploadParams,
    });
  });

  getImages = handleAsync(async (req, res) => {
    const { userId } = req.params;
    const images = await this.mediaService.getUserImages(userId);

    res.status(HTTP_STATUS.OK).json({
      statusCode: HTTP_STATUS.OK,
      message: MEDIA_MESSAGES.IMAGES_FETCH_SUCCESS,
      data: images,
    });
  });

  deleteImage = handleAsync(async (req, res) => {
    const { imageUrl } = req.params;
    const status = await this.mediaService.deleteImageByUrl(imageUrl);

    res.status(HTTP_STATUS.OK).json({
      statusCode: HTTP_STATUS.OK,
      message: MEDIA_MESSAGES.IMAGE_DELETE_SUCCESS,
      data: { status },
    });
  });
}
