import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../shared/stores/auth.store";
import { apiClient } from "../client";
import type {
  Marker,
  MarkerPayload,
  MarkerResponse,
  MarkersResponse,
  PhotoUploadResponse,
} from "./types";

export const useMarkersQuery = (options?: { refetchInterval?: number | false }) => {
  const token = useAuthStore((state) => state.token);

  return useQuery<MarkersResponse>({
    queryKey: ["markers"],
    queryFn: async () => {
      return apiClient<MarkersResponse>("/marker/all", { token });
    },
    refetchInterval: options?.refetchInterval,
  });
};

export const useCreateMarkerMutation = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation<MarkerResponse, Error, MarkerPayload>({
    mutationFn: async (payload) => {
      return apiClient<MarkerResponse>("/marker", {
        method: "POST",
        body: JSON.stringify(payload),
        token,
      });
    },
    onSuccess: () => {
      // Invalidate markers query
      queryClient.invalidateQueries({ queryKey: ["markers"] });
      // Invalidate chats query since user is auto-joined to the new chat
      queryClient.invalidateQueries({ queryKey: ["chats", "all"] });
    },
  });
};

export const useMarkerByIdQuery = (id: number, enabled: boolean = true) => {
  const token = useAuthStore((state) => state.token);

  return useQuery<Marker>({
    queryKey: ["marker", id],
    queryFn: async () => {
      return apiClient<Marker>(`/markers/${id}`, { token });
    },
    enabled,
  });
};

export const useUploadPhotoMutation = () => {
  const token = useAuthStore((state) => state.token);

  return useMutation<
    PhotoUploadResponse,
    Error,
    { uri: string; name: string; type: string }
  >({
    mutationFn: async ({ uri, name, type }) => {
      const formData = new FormData();
      formData.append("image", {
        uri,
        name,
        type,
      } as any);

      const response = await fetch("http://5.75.233.110/api/image/upload", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: "Failed to upload image",
        }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return response.json();
    },
  });
};
