import { create } from "zustand";
import { client, API_ENDPOINTS } from "../api";
import type { AuthUser, Permission } from "../types/auth";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  csrfToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: Permission) => boolean;
  refreshToken: () => Promise<boolean>;
  initializeCSRFToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // localStorage에서 토큰 가져오기
  const savedToken = localStorage.getItem("token");

  return {
    token: savedToken,
    user: null,
    isAuthenticated: !!savedToken, // 토큰이 있으면 인증된 것으로 간주
    isLoading: false,
    error: null,
    csrfToken: null,

    initializeCSRFToken: async () => {
      try {
        const response = await client.get(API_ENDPOINTS.AUTH.CSRF_TOKEN);
        const { csrfToken } = response.data.data;
        set({ csrfToken });

        // CSRF 토큰을 클라이언트 헤더에 설정
        client.defaults.headers.common["X-CSRF-Token"] = csrfToken;
      } catch (error) {
        console.error("CSRF 토큰 초기화 실패:", error);
      }
    },

    login: async (email: string, password: string) => {
      try {
        set({ isLoading: true, error: null });

        // URLSearchParams를 사용하여 application/x-www-form-urlencoded 형식으로 전송
        const params = new URLSearchParams();
        params.append("username", email);
        params.append("password", password);

        console.log("🔐 로그인 시도:", email);

        const response = await client.post("/auth/token", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const { access_token } = response.data;
        console.log("✅ 로그인 성공, 토큰 저장");

        localStorage.setItem("token", access_token);

        // 토큰을 클라이언트 헤더에 설정
        client.defaults.headers.common.Authorization = `Bearer ${access_token}`;

        set({
          token: access_token,
          user: {
            id: 1,
            email,
            username: email.split("@")[0],
            role: "admin",
            permissions: [
              "view_dashboard",
              "manage_licenses",
              "manage_users",
              "manage_notices",
            ],
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error: any) {
        console.error("❌ 로그인 에러:", error);
        set({
          error: error.response?.data?.detail || "로그인에 실패했습니다.",
          isLoading: false,
          isAuthenticated: false,
        });
        throw error;
      }
    },

    refreshToken: async () => {
      try {
        const response = await client.post(API_ENDPOINTS.AUTH.REFRESH);
        const { token } = response.data.data;

        localStorage.setItem("token", token);
        client.defaults.headers.common.Authorization = `Bearer ${token}`;

        set({ token, isAuthenticated: true });
        return true;
      } catch (error) {
        console.error("🔄 토큰 갱신 실패:", error);
        // 리프레시 토큰이 만료된 경우
        localStorage.removeItem("token");
        delete client.defaults.headers.common.Authorization;
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
        return false;
      }
    },

    logout: async () => {
      try {
        console.log("🚪 로그아웃 시작");
        set({ isLoading: true });

        // 백엔드에 로그아웃 요청 (실패해도 클라이언트에서는 로그아웃 처리)
        try {
          await client.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
          console.warn(
            "백엔드 로그아웃 요청 실패 (클라이언트에서는 계속 진행):",
            error
          );
        }

        localStorage.removeItem("token");
        delete client.defaults.headers.common.Authorization;

        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        console.log("✅ 로그아웃 완료");
      } catch (error: any) {
        console.error("❌ 로그아웃 오류:", error);
        set({
          error:
            error.response?.data?.message || "로그아웃 중 오류가 발생했습니다.",
          isLoading: false,
        });
      }
    },

    clearError: () => set({ error: null }),

    hasPermission: (permission: Permission) => {
      const { user } = get();
      return user?.permissions.includes(permission) || false;
    },
  };
});
