import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../shared/stores/auth.store";
import { apiClient } from "../client";
import type {
  ChatHistoryResponse,
  ChatMessage,
  JoinChatPayload,
  JoinChatResponse,
  PendingMessage,
  SendMessagePayload,
  SendMessageResponse,
  TranslateMessagePayload,
  TranslateMessageResponse,
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

export const useSendMessageMutation = (chatId: number) => {
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  return useMutation<SendMessageResponse, Error, SendMessagePayload, { previousData?: ChatHistoryResponse }>({
    mutationFn: async (payload) => {
      return apiClient<SendMessageResponse>(`/message`, {
        method: "POST",
        body: JSON.stringify({ 
          chat_id: payload.chatId, 
          text: payload.message 
        }),
        token,
      });
    },
    onMutate: async (payload) => {
      if (!currentUser) return { previousData: undefined };

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["chat", chatId, "history"] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<ChatHistoryResponse>(["chat", chatId, "history"]);

      // Optimistically update cache with pending message
      if (previousData) {
        const pendingMessage: PendingMessage = {
          id: `pending-${Date.now()}`,
          text: payload.message,
          user: {
            id: currentUser.id,
            email: currentUser.email,
            nickname: currentUser.nickname,
            role: currentUser.role === 'gov' ? 'government' : 'user',
          },
          isPending: true,
        };

        queryClient.setQueryData<ChatHistoryResponse>(["chat", chatId, "history"], {
          ...previousData,
          messages: [...previousData.messages, pendingMessage],
        });
      }

      return { previousData };
    },
    onSuccess: (response, variables, context) => {
      // Replace pending message with real message from server
      if (context?.previousData) {
        queryClient.setQueryData<ChatHistoryResponse>(["chat", chatId, "history"], (old) => {
          if (!old) return context.previousData;
          
          // Remove pending messages and add real message
          const filteredMessages = old.messages.filter(
            (msg) => !('isPending' in msg && msg.isPending)
          );
          
          return {
            ...old,
            messages: [...filteredMessages, response.message],
          };
        });
      }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["chat", chatId, "history"], context.previousData);
      }
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

export const useTranslateMessageMutation = (chatId: number) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation<TranslateMessageResponse, Error, TranslateMessagePayload>({
    mutationFn: async (payload) => {
      return apiClient<TranslateMessageResponse>(
        `/message/${payload.messageId}/translate/?language=${payload.language}`,
        {
          method: "GET",
          token,
        }
      );
    },
    onSuccess: (response) => {
      // Update the message in cache with translation
      queryClient.setQueryData<ChatHistoryResponse>(["chat", chatId, "history"], (old) => {
        if (!old) return old;

        return {
          ...old,
          messages: old.messages.map((msg) => {
            if ('isPending' in msg) return msg;
            if (msg.id === response.id) {
              return { ...msg, translation: response.translatedText } as ChatMessage;
            }
            return msg;
          }),
        };
      });
    },
  });
};
