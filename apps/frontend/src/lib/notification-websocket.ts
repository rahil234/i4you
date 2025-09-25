'use client';

import {io, ManagerOptions, Socket, SocketOptions} from 'socket.io-client';

type EventHandler = (data: any) => void;
type StatusHandler = (status: 'connected' | 'disconnected' | 'error') => void;

class NotificationSocketClient {
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
                console.error('🔌 Socket.IO connection error:', err);
                this.isConnecting = false;
                this.notifyStatusChange('error');
                this.socket?.disconnect();
                this.attemptReconnect();
            });

            this.setupGeneralListener();
        } catch (error) {
            this.isConnecting = false;
            console.error('❌ Error creating Socket.IO connection:', error);
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

    on(event: string, handler: EventHandler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event)!.add(handler);

        return () => {
            this.eventHandlers.get(event)?.delete(handler);
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
        console.warn(`🔁 Attempting reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, delay);
    }
}

let notificationSocket: NotificationSocketClient | null = null;

export function getNotificationSocket() {
    if (!notificationSocket) {
        notificationSocket = new NotificationSocketClient(process.env.NEXT_PUBLIC_API_URL!, {
            path: '/socket.io/notifications',
            transports: ['websocket'],
            withCredentials: true,
        });
    }
    return notificationSocket;
}