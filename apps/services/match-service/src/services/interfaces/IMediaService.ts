export interface IMediaService {
  getUserImages(imageId: string): Promise<string[]>;
}
