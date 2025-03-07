import { api } from "../lib/api";
import { AxiosError } from "axios";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
};

type AuthResponse = {
  user: User;
  token: string;
};

type ApiError = AxiosError<{ message: string }>;

export const authService = {
  // Criar conta
  async signUp(email: string, password: string, name: string): Promise<User> {
    try {
      console.log("Tentando criar conta com:", { email, name });
      const response = await api.post<AuthResponse>("/api/auth/register", {
        email,
        password,
        name,
      });

      // Salvar o token
      localStorage.setItem("@erp:token", response.data.token);
      console.log("Conta criada com sucesso");

      return response.data.user;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Erro ao criar conta:", apiError.response?.data?.message || apiError.message);
      throw apiError;
    }
  },

  // Login
  async signIn(email: string, password: string): Promise<User> {
    try {
      console.log("Tentando fazer login com:", email);
      const response = await api.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      });

      // Salvar o token
      localStorage.setItem("@erp:token", response.data.token);
      console.log("Login realizado com sucesso");

      return response.data.user;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Erro ao fazer login:", apiError.response?.data?.message || apiError.message);
      throw apiError;
    }
  },

  // Logout
  async signOut(): Promise<{ success: boolean }> {
    try {
      console.log("Fazendo logout");
      const response = await api.post<{ success: boolean }>("/api/auth/logout", {});
      localStorage.removeItem("@erp:token");
      console.log("Logout realizado com sucesso");
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Erro ao fazer logout:", apiError.response?.data?.message || apiError.message);
      throw apiError;
    }
  },

  // Recuperar senha
  async resetPassword(email: string): Promise<{ success: boolean }> {
    try {
      console.log("Solicitando recuperação de senha para:", email);
      const response = await api.post<{ success: boolean }>("/api/auth/reset-password", {
        email,
      });

      console.log("Solicitação de recuperação de senha enviada");
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Erro ao solicitar recuperação de senha:", apiError.response?.data?.message || apiError.message);
      throw apiError;
    }
  },

  // Atualizar senha
  async updatePassword(userId: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      console.log("Atualizando senha do usuário:", userId);
      const response = await api.put<{ success: boolean }>(`/api/auth/password/${userId}`, {
        password: newPassword,
      });

      console.log("Senha atualizada com sucesso");
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Erro ao atualizar senha:", apiError.response?.data?.message || apiError.message);
      throw apiError;
    }
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    try {
      console.log("Obtendo usuário atual");
      const response = await api.get<{ user: User }>("/api/auth/me");
      console.log("Usuário atual obtido com sucesso");
      return response.data.user;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Erro ao obter usuário atual:", apiError.response?.data?.message || apiError.message);
      return null;
    }
  },

  // Atualizar dados do usuário
  async updateProfile(userId: string, data: { name?: string; email?: string }): Promise<User> {
    try {
      console.log("Atualizando perfil do usuário:", userId, data);
      const response = await api.put<User>(`/api/auth/profile/${userId}`, data);
      console.log("Perfil atualizado com sucesso");
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Erro ao atualizar perfil:", apiError.response?.data?.message || apiError.message);
      throw apiError;
    }
  },
};
