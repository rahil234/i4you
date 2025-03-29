// This is a simple WebSocket client implementation
// In a real app, you would use a more robust solution

type MessageHandler = (message: any) => void
type StatusHandler = (status: "connected" | "disconnected" | "error") => void

class WebSocketClient {
  private socket: WebSocket | null = null
  private messageHandlers: MessageHandler[] = []
  private statusHandlers: StatusHandler[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null
  private url: string
  private isConnecting = false

  constructor(url: string) {
    this.url = url
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) return

    this.isConnecting = true

    try {
      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        this.reconnectAttempts = 0
        this.isConnecting = false
        this.notifyStatusChange("connected")
      }

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.notifyMessageHandlers(data)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      this.socket.onclose = () => {
        this.isConnecting = false
        this.notifyStatusChange("disconnected")
        this.attemptReconnect()
      }

      this.socket.onerror = (error) => {
        this.isConnecting = false
        console.error("WebSocket error:", error)
        this.notifyStatusChange("error")
        this.socket?.close()
      }
    } catch (error) {
      this.isConnecting = false
      console.error("Error creating WebSocket:", error)
      this.notifyStatusChange("error")
      this.attemptReconnect()
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  send(message: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
      return true
    }
    return false
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler)
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler)
    }
  }

  onStatusChange(handler: StatusHandler) {
    this.statusHandlers.push(handler)
    return () => {
      this.statusHandlers = this.statusHandlers.filter((h) => h !== handler)
    }
  }

  private notifyMessageHandlers(message: any) {
    this.messageHandlers.forEach((handler) => handler(message))
  }

  private notifyStatusChange(status: "connected" | "disconnected" | "error") {
    this.statusHandlers.forEach((handler) => handler(status))
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return

    this.reconnectAttempts++

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)

    this.reconnectTimeout = setTimeout(() => {
      this.connect()
    }, delay)
  }
}

// Create a singleton instance
let wsClient: WebSocketClient | null = null

export function getWebSocketClient() {
  if (!wsClient) {
    // In a real app, this would be your WebSocket server URL
    // For demo purposes, we'll use a mock URL
    wsClient = new WebSocketClient("wss://mock-chat-server.example.com")
  }

  return wsClient
}

