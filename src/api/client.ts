const API_BASE_URL = "http://5.75.233.110/api";

type RequestOptions = RequestInit & {
  token?: string | null;
};

export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit & { Authorization?: string } = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};
