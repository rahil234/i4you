import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SignalingService {
  private _clients: Map<string, Socket> = new Map();

  registerClient(userId: string, socket: Socket) {
    this._clients.set(userId, socket);
    console.log(`User ${userId} registered`);
  }

  sendToUser(userId: string, event: string, data: any) {
    const client = this._clients.get(userId);
    if (client) {
      client.emit(event, data);
    } else {
      console.log(this._clients);
      console.warn(`User ${userId} not found for event ${event}`);
    }
  }

  removeClient(socket: Socket) {
    for (const [userId, client] of this._clients) {
      if (client.id === socket.id) {
        this._clients.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }
}
