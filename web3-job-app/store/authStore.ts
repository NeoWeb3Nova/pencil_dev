import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { login as apiLogin, logout as apiLogout, getProfile } from '@/lib/api';
import type { LoginRequest, AuthResponse } from '@/types';

const TOKEN_KEY = '@web3job:token';
const USER_KEY = '@web3job:user';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthState {
  // 认证状态
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // 动作
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// 获取存储的 token
const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
};

// 存储 token
const setToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    // ignore
  }
};

// 清除 token
const clearToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // ignore
  }
};

// 获取存储的用户
const getUser = async (): Promise<User | null> => {
  try {
    const userStr = await SecureStore.getItemAsync(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch {
    return null;
  }
};

// 存储用户
const setUser = async (user: User): Promise<void> => {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
};

// 清除用户
const clearUser = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {
    // ignore
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  isLoading: false,
  error: null,

  // 登录
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });

    try {
      const result = await apiLogin(credentials);

      if (result.success && result.data) {
        const authData = result.data as AuthResponse;
        await setToken(authData.access_token);
        await setUser(authData.user);

        set({
          isLoggedIn: true,
          user: authData.user,
          isLoading: false,
          error: null,
        });

        return { success: true };
      } else {
        set({
          isLoading: false,
          error: result.error || '登录失败',
        });
        return { success: false, error: result.error || '登录失败' };
      }
    } catch (error) {
      set({
        isLoading: false,
        error: '网络错误，请稍后重试',
      });
      return { success: false, error: '网络错误，请稍后重试' };
    }
  },

  // 登出
  logout: async () => {
    await apiLogout();
    await clearToken();
    await clearUser();
    set({
      isLoggedIn: false,
      user: null,
      error: null,
    });
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 初始化认证状态
  initializeAuth: async () => {
    const token = await getToken();
    if (token) {
      try {
        const profileResult = await getProfile();
        if (profileResult.success && profileResult.data) {
          const user: User = {
            id: profileResult.data.id,
            email: profileResult.data.email,
            name: profileResult.data.name,
            role: profileResult.data.role as 'user' | 'admin',
          };
          await setUser(user);
          set({
            isLoggedIn: true,
            user,
            isLoading: false,
          });
          return;
        }
      } catch {
        // Token 无效，清除
        await clearToken();
      }
    }
    set({
      isLoggedIn: false,
      user: null,
      isLoading: false,
    });
  },

  // 刷新用户资料
  refreshProfile: async () => {
    const token = await getToken();
    if (!token) {
      return;
    }

    try {
      const profileResult = await getProfile();
      if (profileResult.success && profileResult.data) {
        const user: User = {
          id: profileResult.data.id,
          email: profileResult.data.email,
          name: profileResult.data.name,
          role: profileResult.data.role as 'user' | 'admin',
        };
        await setUser(user);
        set({ user });
      }
    } catch {
      // ignore
    }
  },
}));
