import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth";
import type { User } from "../services/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Recuperar usuário do localStorage
const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem("@erp:user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("@erp:token");
        if (token) {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            localStorage.setItem("@erp:user", JSON.stringify(userData));
          } else {
            localStorage.removeItem("@erp:token");
            localStorage.removeItem("@erp:user");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem("@erp:token");
        localStorage.removeItem("@erp:user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await authService.signIn(email, password);
      setUser(userData);
      localStorage.setItem("@erp:user", JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userData = await authService.signUp(email, password, name);
      setUser(userData);
      localStorage.setItem("@erp:user", JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      localStorage.removeItem("@erp:token");
      localStorage.removeItem("@erp:user");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) throw new Error("Usuário não autenticado");
    setLoading(true);
    try {
      await authService.updatePassword(user.id, newPassword);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; email?: string }) => {
    if (!user) throw new Error("Usuário não autenticado");
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(user.id, data);
      setUser(updatedUser);
      localStorage.setItem("@erp:user", JSON.stringify(updatedUser));
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
