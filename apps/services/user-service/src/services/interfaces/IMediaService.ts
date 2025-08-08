export default interface IMediaService {
  getUserImages(imageId: string): Promise<string[]>;
}
