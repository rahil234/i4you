import IMediaService from '@/services/interfaces/IMediaService';

export class MediaService implements IMediaService {
  async getUserImages(userId: string): Promise<string[]> {
    const { images } = await (
      await fetch(
        'http://media-service.app.svc.cluster.local:4003/get-images/' + userId
      )
    ).json();
    return images;
  }
}
