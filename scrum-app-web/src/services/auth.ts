import { apiService } from "./api";
import {
  LoginCredentials,
  AuthResponse,
  GuestUserData,
  AuthMeResponse,
} from "@/types/auth";
import Cookies from "js-cookie";

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      // Salvar token nos cookies
      Cookies.set("auth-token", response.token, { expires: 7 }); // 7 dias

      return response;
    } catch (error) {
      throw error;
    }
  }

  async createGuestUser(guestData: GuestUserData): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        "/auth/guest",
        guestData
      );

      // Salvar token nos cookies
      Cookies.set("auth-token", response.token, { expires: 1 }); // 1 dia para convidados

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthMeResponse | null> {
    try {
      const token = Cookies.get("auth-token");
      if (!token) return null;

      const response = await apiService.get<AuthMeResponse>("/auth/me");
      return response;
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error);
      this.logout();
      return null;
    }
  }

  logout(): void {
    Cookies.remove("auth-token");
    window.location.href = "/login";
  }

  isAuthenticated(): boolean {
    return !!Cookies.get("auth-token");
  }
}

export const authService = new AuthService();
