import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { login as apiLogin, logout as apiLogout, getProfile } from '@/lib/api';
import type { LoginRequest, UserProfile } from '@/types';

const TOKEN_KEY = '@web3job:token';
const USER_KEY = '@web3job:user';

interface AuthState {
  // 认证状态
  isLoggedIn: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  token: string | null;

  // 动作
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  isLoading: true,
  user: null,
  token: null,

  // 初始化认证 - 应用启动时调用
  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);

      if (token) {
        // 验证 token 是否有效
        try {
          const profileResult = await getProfile();
          if (profileResult.success && profileResult.data) {
            set({
              isLoggedIn: true,
              token,
              user: profileResult.data as UserProfile,
              isLoading: false,
            });
            return;
          }
        } catch {
          // Token 无效，清除存储
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await SecureStore.deleteItemAsync(USER_KEY);
        }
      }

      // 未登录状态
      set({
        isLoggedIn: false,
        token: null,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ isLoading: false });
    }
  },

  // 登录
  login: async (credentials: LoginRequest) => {
    try {
      set({ isLoading: true });

      const result = await apiLogin(credentials);

      if (!result.success || !result.data) {
        set({ isLoading: false });
        return {
          success: false,
          error: result.error || '登录失败',
        };
      }

      const { access_token, user } = result.data;

      // 存储 token 和用户信息
      await SecureStore.setItemAsync(TOKEN_KEY, access_token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      set({
        isLoggedIn: true,
        token: access_token,
        user: user as UserProfile,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      return {
        success: false,
        error: '网络错误，请稍后重试',
      };
    }
  },

  // 登出
  logout: async () => {
    try {
      await apiLogout();
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);

      set({
        isLoggedIn: false,
        token: null,
        user: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // 刷新用户资料
  refreshProfile: async () => {
    try {
      const result = await getProfile();
      if (result.success && result.data) {
        set({ user: result.data as UserProfile });
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  },
}));

// 辅助 hook - 获取认证状态
export const useAuth = () => {
  const { isLoggedIn, user, isLoading } = useAuthStore();
  return { isLoggedIn, user, isLoading };
};
