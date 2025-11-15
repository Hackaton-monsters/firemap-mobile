import type { ChatMessage, WebSocketMessage } from "@/src/api/chat/types";
import { useAuthStore } from "../stores/auth.store";

type MessageCallback = (message: ChatMessage) => void;

class ChatWebSocketService {
  private ws: WebSocket | null = null;
  private subscribers = new Map<number, Set<MessageCallback>>();
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 3000;
  private isIntentionallyClosed = false;

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isIntentionallyClosed = false;
    const wsUrl = `ws://5.75.233.110/api/chat/ws?token=${token}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          // console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        // console.error("WebSocket error:", error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.ws = null;

        if (!this.isIntentionallyClosed) {
          this.scheduleReconnect(token);
        }
      };
    } catch (error) {
      // console.error("Failed to create WebSocket connection:", error);
      this.scheduleReconnect(token);
    }
  }

  private scheduleReconnect(token: string) {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log("Attempting to reconnect WebSocket...");
      this.connect(token);
    }, this.reconnectDelay);
  }

  private handleMessage(data: WebSocketMessage) {
    if (data.type === "new_message" && data.message) {
      const callbacks = this.subscribers.get(data.chatId);
      if (callbacks) {
        callbacks.forEach((callback) => callback(data.message!));
      }
    }
  }

  subscribe(chatId: number, callback: MessageCallback) {
    if (!this.subscribers.has(chatId)) {
      this.subscribers.set(chatId, new Set());
    }
    this.subscribers.get(chatId)!.add(callback);

    return () => {
      const callbacks = this.subscribers.get(chatId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(chatId);
        }
      }
    };
  }

  disconnect() {
    this.isIntentionallyClosed = true;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.subscribers.clear();
  }

  getConnectionState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

export const chatWebSocketService = new ChatWebSocketService();

export const useChatWebSocket = () => {
  const token = useAuthStore((state) => state.token);

  const connect = () => {
    if (token) {
      chatWebSocketService.connect(token);
    }
  };

  const disconnect = () => {
    chatWebSocketService.disconnect();
  };

  return { connect, disconnect };
};
