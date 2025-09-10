'use client';

import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

type Handler = (...args: any[]) => void;
type StatusHandler = (status: 'connected' | 'disconnected' | 'error') => void

class SocketIOClient {
  private socket: Socket | null = null;
  private statusHandlers: StatusHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private readonly url: string;
  private readonly options: Partial<ManagerOptions & SocketOptions>;
  private isConnecting = false;

  constructor(url: string, options: Partial<ManagerOptions & SocketOptions>) {
    this.url = url;
    this.options = options;
  }

  connect() {
    if (this.socket?.connected || this.isConnecting) return;

    this.isConnecting = true;

    try {
      this.socket = io(this.url, {
        ...this.options,
        autoConnect: false,
        reconnection: false,
      });

      this.socket.connect();

      this.socket.on('connect', () => {
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.notifyStatusChange('connected');
      });

      this.socket.on('disconnect', () => {
        this.isConnecting = false;
        this.notifyStatusChange('disconnected');
        this.attemptReconnect();
      });

      this.socket.on('connect_error', (err) => {
        console.error('Socket.IO error:', err);
        this.isConnecting = false;
        this.notifyStatusChange('error');
        this.socket?.disconnect();
        this.attemptReconnect();
      });
    } catch (error) {
      this.isConnecting = false;
      console.error('Error creating Socket.IO connection:', error);
      this.notifyStatusChange('error');
      this.attemptReconnect();
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return this.socket?.connected;
  }

  send(event: string, payload: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, payload);
      return true;
    }
    return false;
  }

  joinRoom(chatId: string) {
    return this.send('joinRoom', chatId);
  }

  leaveRoom(chatId: string) {
    return this.send('leaveRoom', chatId);
  }

  on(event: string, handler: Handler) {
    this.socket?.on(event, handler);
    return () => {
      this.socket?.off(event, handler);
    };
  }

  onStatusChange(handler: StatusHandler) {
    this.statusHandlers.push(handler);
    return () => {
      this.statusHandlers = this.statusHandlers.filter((h) => h !== handler);
    };
  }

  private notifyStatusChange(status: 'connected' | 'disconnected' | 'error') {
    this.statusHandlers.forEach((handler) => handler(status));
  }

  private attemptReconnect() {
    console.log(`Attempting to reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }
}

let socketClient: SocketIOClient | null = null;

export function getSocketClient() {
  if (!socketClient) {
    socketClient = new SocketIOClient('https://i4you.local.net', {
      path: '/socket.io/chat',
      transports: ['websocket'],
      withCredentials: true,
    });
  }
  return socketClient;
}
