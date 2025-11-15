import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../shared/stores/auth.store';
import { apiClient } from '../client';

type User = {
  id: string;
  email: string;
  nickname: string;
  role: 'user' | 'gov';
};

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: User;
};

type RegisterPayload = {
  email: string;
  password: string;
  nickname: string;
};

type RegisterResponse = {
  token: string;
  user: User;
};

type MeResponse = User;

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload) => {
      return apiClient<LoginResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
};

export const useRegisterMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: async (payload) => {
      return apiClient<RegisterResponse>('/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
};

export const useMeQuery = () => {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<MeResponse, Error>({
    queryKey: ['me'],
    queryFn: async () => {
      return apiClient<MeResponse>('/auth/me', {
        method: 'GET',
        token,
      });
    },
    enabled: isAuthenticated && !!token,
  });
};
