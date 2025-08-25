import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SignalingService {
  private clients: Map<string, Socket> = new Map();

  registerClient(userId: string, socket: Socket) {
    this.clients.set(userId, socket);
    console.log(`User ${userId} registered`);
  }

  sendToUser(userId: string, event: string, data: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit(event, data);
    } else {
      console.log(this.clients);
      console.warn(`User ${userId} not found for event ${event}`);
    }
  }

  removeClient(socket: Socket) {
    for (const [userId, client] of this.clients) {
      if (client.id === socket.id) {
        this.clients.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }
}
