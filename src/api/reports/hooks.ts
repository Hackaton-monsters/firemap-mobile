import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { Marker, MarkerPayload, MarkerResponse, MarkersResponse } from './types';

export const useMarkersQuery = () =>
  useQuery<MarkersResponse>({
    queryKey: ['markers'],
    queryFn: async () => {
      const token = null; // TODO: Get token from auth store
      return apiClient<MarkersResponse>('/markers', { token });
    },
  });

export const useCreateMarkerMutation = () =>
  useMutation<MarkerResponse, Error, MarkerPayload>({
    mutationFn: async (payload) => {
      const token = null; // TODO: Get token from auth store
      return apiClient<MarkerResponse>('/markers', {
        method: 'POST',
        body: JSON.stringify(payload),
        token,
      });
    },
  });

export const useMarkerByIdQuery = (id: number, enabled: boolean = true) =>
  useQuery<Marker>({
    queryKey: ['marker', id],
    queryFn: async () => {
      const token = null; // TODO: Get token from auth store
      return apiClient<Marker>(`/markers/${id}`, { token });
    },
    enabled,
  });
