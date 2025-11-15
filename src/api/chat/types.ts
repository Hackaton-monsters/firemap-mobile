export type ChatMessage = {
  id: number;
  chatId: number;
  userId: string;
  username: string;
  message: string;
  createdAt: string;
};

export type ChatHistoryResponse = {
  messages: ChatMessage[];
};

export type SendMessagePayload = {
  chatId: number;
  message: string;
};

export type SendMessageResponse = {
  message: ChatMessage;
};

export type JoinChatPayload = {
  chatId: number;
};

export type JoinChatResponse = {
  success: boolean;
};

export type WebSocketMessage = {
  type: 'new_message' | 'user_joined' | 'user_left';
  chatId: number;
  message?: ChatMessage;
  userId?: string;
  username?: string;
};
