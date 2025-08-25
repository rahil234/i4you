'use client';

import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

type EventHandler = (data: any) => void;
type StatusHandler = (status: 'connected' | 'disconnected' | 'error') => void;

class VideoSocketClient {
  private socket: Socket | null = null;
  private statusHandlers: StatusHandler[] = [];
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
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
        console.error('📞 VideoSocket connection error:', err);
        this.isConnecting = false;
        this.notifyStatusChange('error');
        this.socket?.disconnect();
        this.attemptReconnect();
      });

      this.setupGeneralListener();
    } catch (error) {
      this.isConnecting = false;
      console.error('❌ Error creating VideoSocket connection:', error);
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

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  on(event: string, handler: EventHandler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  off(event: string, handler?: EventHandler) {
    if (!this.eventHandlers.has(event)) return;

    if (handler) {
      // Remove specific handler
      this.eventHandlers.get(event)?.delete(handler);
    } else {
      // Remove all handlers for this event
      this.eventHandlers.set(event, new Set());
    }

    // Also remove from actual socket
    if (this.socket) {
      if (handler) {
        this.socket.off(event, handler as any);
      } else {
        this.socket.removeAllListeners(event);
      }
    }
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

  private setupGeneralListener() {
    if (!this.socket) return;
    this.socket.onAny((event, data) => {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        handlers.forEach((handler) => handler(data));
      }
    });
  }

  private attemptReconnect() {
    console.warn(`🔁 VideoSocket reconnect attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`);
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }
}

let videoSocket: VideoSocketClient | null = null;

export function getVideoSocket() {
  if (!videoSocket) {
    console.log('🆕 Creating VideoSocketClient');
    videoSocket = new VideoSocketClient('https://i4you.local.net', {
      secure: false,
      path: '/socket.io/video',
      transports: ['websocket'],
      withCredentials: true,
    });
    videoSocket.connect();
  }
  return videoSocket;
}