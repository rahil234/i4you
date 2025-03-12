type IMessage = {
    sender: string;
    message: string;
    id: string;
    type: ("message" | "typing" | "status");
    chatId: string;
    isTyping: boolean;
    content: string;
    timestamp: string;
};

type MessageHandler = (message: IMessage) => void;
type StatusHandler = (status: "connected" | "disconnected" | "error") => void;

class WebSocketClient {
    private socket: WebSocket | null = null;
    private messageHandlers: MessageHandler[] = [];
    private statusHandlers: StatusHandler[] = [];
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private readonly url: string;
    private isConnecting = false;
    private userId: string | null = null;

    constructor(url: string) {
        this.url = url;
    }

    connect(userId: string) {
        if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) return;

        this.isConnecting = true;
        this.userId = userId;

        try {
            this.socket = new WebSocket(this.url);

            this.socket.onopen = () => {
                this.reconnectAttempts = 0;
                this.isConnecting = false;
                this.notifyStatusChange("connected");

                // Send the "join" event to register the user
                this.send({event: "join", userId});
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.event === "receive_message") {
                        this.notifyMessageHandlers({sender: data.sender, message: data.message});
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };

            this.socket.onclose = () => {
                this.isConnecting = false;
                this.notifyStatusChange("disconnected");
                this.attemptReconnect();
            };

            this.socket.onerror = (error) => {
                this.isConnecting = false;
                console.error("WebSocket error:", error);
                this.notifyStatusChange("error");
                this.socket?.close();
            };
        } catch (error) {
            this.isConnecting = false;
            console.error("Error creating WebSocket:", error);
            this.notifyStatusChange("error");
            this.attemptReconnect();
        }
    }

    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    // sendMessage({receiver, message}: any) {
    //     if (this.socket?.readyState === WebSocket.OPEN && this.userId) {
    //         this.send({event: "send_message", sender: this.userId, receiver, message});
    //         console.log("rahil", receiver, message);
    //         return true;
    //     }
    //     return false;
    // }

    onMessage(handler: MessageHandler) {
        this.messageHandlers.push(handler);
        return () => {
            this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
        };
    }

    onStatusChange(handler: StatusHandler) {
        this.statusHandlers.push(handler);
        return () => {
            this.statusHandlers = this.statusHandlers.filter((h) => h !== handler);
        };
    }

    private send(data: any) {
        console.log("Sending message", data);
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    private notifyMessageHandlers(message: { sender: string; message: string }) {
        this.messageHandlers.forEach((handler) => handler(message));
    }

    private notifyStatusChange(status: "connected" | "disconnected" | "error") {
        this.statusHandlers.forEach((handler) => handler(status));
    }

    private attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

        this.reconnectAttempts++;

        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

        this.reconnectTimeout = setTimeout(() => {
            if (this.userId) {
                this.connect(this.userId);
            }
        }, delay);
    }
}

// Singleton instance
let wsClient: WebSocketClient | null = null;

export function getWebSocketClient() {
    console.log("Connecting to WebSocket server...")

    if (!wsClient) {
        wsClient = new WebSocketClient("ws://localhost:4000");
    }

    return wsClient;
}