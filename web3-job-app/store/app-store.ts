import { create } from 'zustand';
import { getStoredLanguage, saveLanguagePreference, getStoredTheme, saveThemePreference } from '@/lib/storage';

interface AppState {
  // 用户相关
  isLoggedIn: boolean;
  userId: string | null;

  // 搜索相关
  searchQuery: string;
  selectedCategory: string;

  // 语言设置
  language: 'zh' | 'en';

  // 主题设置
  themeMode: 'light' | 'dark';

  // 动作
  login: () => void;
  logout: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setLanguage: (language: 'zh' | 'en') => void;
  loadLanguage: () => Promise<void>;
  saveLanguage: (language: 'zh' | 'en') => Promise<void>;
  setThemeMode: (theme: 'light' | 'dark') => Promise<void>;
  loadTheme: () => Promise<void>;
  saveTheme: (theme: 'light' | 'dark') => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  userId: null,
  searchQuery: '',
  selectedCategory: '',
  language: 'zh',
  themeMode: 'light',

  login: () => set({ isLoggedIn: true, userId: 'user-1' }),
  logout: () => set({ isLoggedIn: false, userId: null }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (category: string) => set({ selectedCategory: category }),
  setLanguage: (language: 'zh' | 'en') => set({ language }),
  loadLanguage: async () => {
    const storedLanguage = await getStoredLanguage();
    if (storedLanguage === 'zh' || storedLanguage === 'en') {
      set({ language: storedLanguage });
    }
  },
  saveLanguage: async (language: 'zh' | 'en') => {
    set({ language });
    await saveLanguagePreference(language);
  },
  setThemeMode: async (theme: 'light' | 'dark') => {
    set({ themeMode: theme });
    await saveThemePreference(theme);
  },
  loadTheme: async () => {
    const storedTheme = await getStoredTheme();
    if (storedTheme === 'light' || storedTheme === 'dark') {
      set({ themeMode: storedTheme });
    }
  },
  saveTheme: async (theme: 'light' | 'dark') => {
    set({ themeMode: theme });
    await saveThemePreference(theme);
  },
}));
