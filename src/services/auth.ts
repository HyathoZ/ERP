import { api } from "./api";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
};

type AuthResponse = {
  user: User;
  message?: string;
};

export const authService = {
  // Criar conta
  async signUp(email: string, password: string, name: string): Promise<User> {
    try {
      const response = await api.post<User>("/auth/register", {
        email,
        password,
        name,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      throw error;
    }
  },

  // Login
  async signIn(email: string, password: string): Promise<User> {
    try {
      const response = await api.post<User>("/auth/login", {
        email,
        password,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  },

  // Logout
  async signOut(): Promise<{ success: boolean }> {
    try {
      const response = await api.post<{ success: boolean }>("/auth/logout", {});

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  },

  // Recuperar senha
  async resetPassword(email: string): Promise<{ success: boolean }> {
    try {
      // Implementar lógica de reset de senha
      const response = await api.post<{ success: boolean }>("/auth/reset-password", {
        email,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      throw error;
    }
  },

  // Atualizar senha
  async updatePassword(userId: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      const response = await api.put<{ success: boolean }>(`/auth/password/${userId}`, {
        password: newPassword,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      throw error;
    }
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<User>("/auth/me");

      if (response.error) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error);
      return null;
    }
  },

  // Atualizar dados do usuário
  async updateProfile(userId: string, data: { name?: string; email?: string }): Promise<User> {
    try {
      const response = await api.put<User>(`/auth/profile/${userId}`, data);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  },
};
