import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from '../services/notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  handleConnection(socket: Socket) {
    const userId = socket.handshake.headers['x-user-id'];

    if (typeof userId === 'string') {
      console.log(`Registering user ${userId} with socket ${socket.id}`);
      this.notificationsService
        .saveSocketMapping(userId, socket.id)
        .then(async () => {
          console.log(`User ${userId} registered with socket ${socket.id}`);
          const id = await this.notificationsService.getSocketId(userId);
          console.log('id :', id);
        })
        .catch((err) => console.error(`Error saving mapping: ${err}`));
    } else {
      console.warn(`No x-user-id header found for socket ${socket.id}`);
    }

    socket.on('disconnect', () => {
      this.notificationsService
        .removeSocketMapping(socket.id)
        .then(() => console.log(`Socket ${socket.id} mapping removed`))
        .catch((err) => console.error(`Error removing socket mapping: ${err}`));
      console.log(`Disconnected: ${socket.id}`);
    });
  }

  async emitToUser(userId: string, event: string, payload: any) {
    const socketId = await this.notificationsService.getSocketId(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, payload);
    }
  }
}
