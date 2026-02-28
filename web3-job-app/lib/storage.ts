import * as SecureStore from 'expo-secure-store';

const LANGUAGE_KEY = 'web3_job_app_language';
const THEME_KEY = 'web3_job_app_theme';

// 检测是否在 Web 环境
const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export async function getStoredLanguage(): Promise<string | null> {
  try {
    // expo-secure-store 在 Web 上自动使用 localStorage
    const language = await SecureStore.getItemAsync(LANGUAGE_KEY);
    return language;
  } catch (error) {
    console.error('Failed to get stored language:', error);
    return null;
  }
}

export async function saveLanguagePreference(language: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
}

// Theme storage functions
export async function getStoredTheme(): Promise<'light' | 'dark' | null> {
  try {
    const theme = await SecureStore.getItemAsync(THEME_KEY);
    if (theme === 'light' || theme === 'dark') {
      return theme;
    }
    return null;
  } catch (error) {
    console.error('Failed to get stored theme:', error);
    return null;
  }
}

export async function saveThemePreference(theme: 'light' | 'dark'): Promise<void> {
  try {
    await SecureStore.setItemAsync(THEME_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
}
