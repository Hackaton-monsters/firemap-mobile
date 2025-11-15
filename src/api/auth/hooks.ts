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
      // Fake login implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));
debugger
      if (
        payload.email === 'demo@email.com' &&
        payload.password === 'password'
      ) {
        return {
          token: 'fake-jwt-token-demo-user',
          user: {
            id: '1',
            email: 'demo@email.com',
            nickname: 'Demo User',
            role: 'user' as const,
          },
        };
      }

      throw new Error('Invalid credentials');
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
      // Fake registration implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!payload.email || !payload.password || !payload.nickname) {
        throw new Error('All fields are required');
      }

      return {
        token: 'fake-jwt-token-' + Date.now(),
        user: {
          id: Date.now().toString(),
          email: payload.email,
          nickname: payload.nickname,
          role: 'user' as const,
        },
      };
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
