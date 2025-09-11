import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { AuthenticatedSocket } from '../../types/authenticated-socket.js';
import { ISocketService } from '../../socket/services/interfaces/ISocketService';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('SocketService')
    private readonly _socketService: ISocketService,
  ) {}

  afterInit(server: Server) {
    server.use((socket, next) => {
      const userId = socket.handshake.headers['x-user-id'] as string;
      const userRole = socket.handshake.headers['x-user-role'] as string;
      if (!userId || !userRole) {
        return next(new Error('Missing x-user-id || x-user-role header'));
      }
      (socket as AuthenticatedSocket).user = { id: userId, role: userRole };
      next();
    });
  }

  @SubscribeMessage('join')
  handleConnection(socket: Socket) {
    const userId = socket.handshake.headers['x-user-id'];

    if (typeof userId === 'string') {
      this._socketService
        .saveSocketMapping(userId, socket.id)
        .catch((err) => console.error(`Error saving mapping: ${err}`));
    } else {
      console.warn(`No x-user-id header found for socket ${socket.id}`);
    }

    socket.on('disconnect', () => {
      this._socketService
        .removeSocketMapping(socket.id)
        .then(() => console.log(`Socket ${socket.id} mapping removed`))
        .catch((err) => console.error(`Error removing socket mapping: ${err}`));
      console.log(`Disconnected: ${socket.id}`);
    });
  }

  async emitToUser(userId: string, event: string, payload: any) {
    const socketId = await this._socketService.getSocketId(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, payload);
    }
  }
}
