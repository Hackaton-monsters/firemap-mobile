import { Report } from "../reports/types";

export type ChatUser = {
  id: number;
  nickname: string;
  email: string;
  role: "user" | "government";
};

export type ChatMessage = {
  id: number;
  text: string;
  user: ChatUser;
  created_at: string;
  translation?: string;
};

export type PendingMessage = {
  id: string;
  text: string;
  user: ChatUser;
  isPending: true;
};

export type DisplayMessage = ChatMessage | PendingMessage;

export type ChatHistoryResponse = {
  id: number;
  marker: {
    id: number;
    chatId: number;
    lat: number;
    lon: number;
    reports: null;
    reportsCount: number;
    type: "fire" | "rescue";
    title: string;
  };
  messages: DisplayMessage[];
};

export type SendMessagePayload = {
  chatId: number;
  message: string;
};

export type SendMessageResponse = {
  message: ChatMessage;
  chatId: ChatUser["id"];
};

export type JoinChatPayload = {
  chatId: number;
};

export type JoinChatResponse = {
  success: boolean;
};

export type WebSocketMessage = {
  type: "message";
  payload: {
    message: ChatMessage;
    chatId: number;
  };
};

export type TranslateMessagePayload = {
  messageId: number;
  language: string;
};

export type TranslateMessageResponse = {
  id: number;
  translatedText: string;
};

export type ChatListItem = {
  id: number;
  marker: {
    id: number;
    chatId: number;
    lat: number;
    lon: number;
    type: "fire" | "rescue";
    title: string;
    reportsCount: number;
    reports: Report[];
  };
  messages?: [ChatMessage];
};

export type AllChatsResponse = {
  chats: ChatListItem[];
};
