import { create } from 'zustand';

interface AppState {
  // 用户相关
  isLoggedIn: boolean;
  userId: string | null;

  // 搜索相关
  searchQuery: string;
  selectedCategory: string;

  // 动作
  login: () => void;
  logout: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  userId: null,
  searchQuery: '',
  selectedCategory: '',

  login: () => set({ isLoggedIn: true, userId: 'user-1' }),
  logout: () => set({ isLoggedIn: false, userId: null }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (category: string) => set({ selectedCategory: category }),
}));
