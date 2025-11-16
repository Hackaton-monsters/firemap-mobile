import type { ChatMessage, WebSocketMessage } from "@/src/api/chat/types";
import { useAuthStore } from "../stores/auth.store";

type MessageCallback = (message: ChatMessage) => void;

const WS_SERVER_URL = "ws://5.75.233.110";

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
    const wsUrl = `${WS_SERVER_URL}/ws?token=${token}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
        // Resubscribe to all active chats after reconnection
        this.resubscribeAll();
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
    if (data.type === "message" && data.payload) {
      const callbacks = this.subscribers.get(data.payload.chatId);
      if (callbacks) {
        callbacks.forEach((callback) => callback(data.payload.message));
      }
    }
  }

  subscribe(chatId: number, callback: MessageCallback) {
    if (!this.subscribers.has(chatId)) {
      this.subscribers.set(chatId, new Set());
      // Send subscribe message to server when first subscriber for this chat
      this.sendSubscribe(chatId);
    }
    this.subscribers.get(chatId)!.add(callback);

    return () => {
      const callbacks = this.subscribers.get(chatId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(chatId);
          // Send unsubscribe message to server when no more subscribers for this chat
          this.sendUnsubscribe(chatId);
        }
      }
    };
  }

  private sendSubscribe(chatId: number) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "subscribe",
          chat_id: chatId,
        })
      );
      console.log(`Subscribed to chat ${chatId}`);
    }
  }

  private sendUnsubscribe(chatId: number) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "unsubscribe",
          chat_id: chatId,
        })
      );
      console.log(`Unsubscribed from chat ${chatId}`);
    }
  }

  private resubscribeAll() {
    // Resubscribe to all chats that have active subscribers
    this.subscribers.forEach((callbacks, chatId) => {
      if (callbacks.size > 0) {
        this.sendSubscribe(chatId);
      }
    });
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
