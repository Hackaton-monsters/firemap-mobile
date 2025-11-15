import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../shared/stores/auth.store";
import { apiClient } from "../client";
import type {
  ChatHistoryResponse,
  JoinChatPayload,
  JoinChatResponse,
  SendMessagePayload,
  SendMessageResponse,
} from "./types";

export const useChatHistoryQuery = (chatId: number, enabled: boolean = true) => {
  const token = useAuthStore((state) => state.token);

  return useQuery<ChatHistoryResponse>({
    queryKey: ["chat", chatId, "history"],
    queryFn: async () => {
      return apiClient<ChatHistoryResponse>(`/chat/${chatId}/history`, {
        token,
      });
    },
    enabled,
  });
};

export const useSendMessageMutation = () => {
  const token = useAuthStore((state) => state.token);

  return useMutation<SendMessageResponse, Error, SendMessagePayload>({
    mutationFn: async (payload) => {
      return apiClient<SendMessageResponse>(`/chat/${payload.chatId}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: payload.message }),
        token,
      });
    },
  });
};

export const useJoinChatMutation = () => {
  const token = useAuthStore((state) => state.token);

  return useMutation<JoinChatResponse, Error, JoinChatPayload>({
    mutationFn: async (payload) => {
      return apiClient<JoinChatResponse>(`/chat/${payload.chatId}/join`, {
        method: "POST",
        token,
      });
    },
  });
};
