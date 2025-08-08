import IMediaService from '@/services/interfaces/IMediaService';

export class MediaService implements IMediaService {
  async getUserImages(userId: string): Promise<string[]> {
    console.log('Fetching images for userId:', userId);
    const { images } = await (
      await fetch(
        'http://media-service.app.svc.cluster.local:4003/get-images/' + userId
      )
    ).json();
    console.log('Fetched images from media service:', images);
    return images;
  }
}
