export type ChatUser = {
  id: number;
  nickname: string;
  email: string;
  role: 'user' | 'government';
};

export type ChatMessage = {
  id: number;
  text: string;
  user: ChatUser;
  createdAt: string;
};

export type ChatHistoryResponse = {
  id: number;
  marker: {
    id: number;
    chatId: number;
    lat: number;
    lon: number;
    reports: null;
    reportsCount: number;
    type: 'fire' | 'rescue';
    title: string;
  };
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
