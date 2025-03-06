import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { User } from "../types";
import { toast } from "react-toastify";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => void;
}

// 解析 JWT token
const parseJwt = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("https://dummyjson.com/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              password,
              expiresInMins: 60,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
          }

          const userData = await response.json();

          // 從 JWT token 中解析過期時間
          const decodedToken = parseJwt(userData.accessToken);
          const tokenExpiration = decodedToken?.exp
            ? decodedToken.exp * 1000
            : null;

          set({
            user: { ...userData, tokenExpiration },
            isAuthenticated: true,
            isLoading: false,
          });

          // 如果成功解析到過期時間，設置自動登出
          if (tokenExpiration) {
            const timeUntilExpiration = tokenExpiration - Date.now();
            if (timeUntilExpiration > 0) {
              setTimeout(() => {
                const state = get();
                if (state.isAuthenticated) {
                  state.logout();
                  toast.info("Your session has expired. Please login again.");
                }
              }, timeUntilExpiration);
            }
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      checkAuthStatus: () => {
        const state = get();
        if (!state.user || !state.isAuthenticated) return;

        // 檢查 token 是否過期
        if (
          state.user.tokenExpiration &&
          Date.now() > state.user.tokenExpiration
        ) {
          state.logout();
          toast.info("Your session has expired. Please login again.");
          return;
        }

        // 如果 token 還沒過期，設置新的自動登出定時器
        const remainingTime = state.user.tokenExpiration - Date.now();
        if (remainingTime > 0) {
          setTimeout(() => {
            const currentState = get();
            if (currentState.isAuthenticated) {
              currentState.logout();
              toast.info("Your session has expired. Please login again.");
            }
          }, remainingTime);
        }
      },
    }),
    {
      name: "auth-storage",
      // 只保存某些字段到localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.checkAuthStatus();
      },
    }
  )
);
