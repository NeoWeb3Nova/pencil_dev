import { create } from 'zustand';
import { getStoredLanguage, saveLanguagePreference, getStoredTheme, saveThemePreference } from '@/lib/storage';

interface AppState {
  // 搜索相关
  searchQuery: string;
  selectedCategory: string;

  // 语言设置
  language: 'zh' | 'en';

  // 主题设置
  themeMode: 'light' | 'dark';

  // 动作
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
  searchQuery: '',
  selectedCategory: '',
  language: 'zh',
  themeMode: 'light',
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

// 辅助 hook - 导出 useAuth 供外部使用
export { useAuth } from './authStore';
