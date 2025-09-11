export interface ISocketService {
  saveSocketMapping(userId: string, socketId: string): Promise<void>;

  getSocketId(userId: string): Promise<string | null>;

  removeSocketMapping(userId: string): Promise<void>;
}
