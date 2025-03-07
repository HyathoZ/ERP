import axios, { AxiosRequestConfig } from "axios";

interface RequestOptions extends AxiosRequestConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

const api = {
  request: async <T>(endpoint: string, options: RequestOptions): Promise<ApiResponse<T>> => {
    const response = await axios.request<T>({
      url: `http://localhost:3001${endpoint}`,
      ...options,
    });
    return { data: response.data, status: response.status };
  },

  post: async <T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> => {
    return api.request<T>(endpoint, {
      method: "POST",
      data,
    });
  },

  get: async <T>(endpoint: string, options?: Omit<RequestOptions, "method">): Promise<ApiResponse<T>> => {
    return api.request<T>(endpoint, {
      method: "GET",
      ...options,
    });
  },

  put: async <T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> => {
    return api.request<T>(endpoint, {
      method: "PUT",
      data,
    });
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    return api.request<T>(endpoint, {
      method: "DELETE",
    });
  },
};

export { api };
