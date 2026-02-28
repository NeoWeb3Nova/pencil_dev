import * as SecureStore from 'expo-secure-store';

const LANGUAGE_KEY = 'web3_job_app_language';

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
