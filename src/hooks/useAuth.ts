import { useEffect, useState } from "react";
import { User, authService } from "../services/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      setLoading(true);
      const user = await authService.signIn(email, password);
      setUser(user);
      return { error: null };
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return { error: error instanceof Error ? error.message : "Erro ao fazer login" };
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, name: string) {
    try {
      setLoading(true);
      const user = await authService.signUp(email, password, name);
      setUser(user);
      return { error: null };
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      return { error: error instanceof Error ? error.message : "Erro ao criar conta" };
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      return { error: null };
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      return { error: error instanceof Error ? error.message : "Erro ao fazer logout" };
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(data: { name?: string; email?: string }) {
    try {
      setLoading(true);
      if (!user) throw new Error("Usuário não autenticado");
      const updatedUser = await authService.updateProfile(user.id, data);
      setUser(updatedUser);
      return { error: null };
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return { error: error instanceof Error ? error.message : "Erro ao atualizar perfil" };
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}
