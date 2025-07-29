"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types/auth";
import { authService } from "@/services/auth";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  processGoogleToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        if (authService.isAuthenticated()) {
          const response = await authService.getCurrentUser();
          if (response?.user) {
            setUser(response?.user);
          } else {
            console.error("Usuário não encontrado");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const processGoogleToken = async (token: string) => {
    try {
      setLoading(true);
      // Salvar o token nos cookies
      Cookies.set("auth-token", token, { expires: 7 });
      
      // Buscar as informações do usuário
      const response = await authService.getCurrentUser();
      if (response?.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error("Erro ao processar token do Google:", error);
      Cookies.remove("auth-token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, processGoogleToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
