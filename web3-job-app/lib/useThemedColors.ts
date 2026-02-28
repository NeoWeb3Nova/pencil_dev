import { useAppStore } from '@/store/app-store';
import { colors } from '@/lib/constants';

/**
 * 根据当前主题返回对应的颜色值
 * @param lightColor 浅色模式颜色
 * @param darkColor 深色模式颜色
 * @returns 当前主题对应的颜色值
 */
export function useThemedColor(lightColor: string, darkColor: string): string {
  const { themeMode } = useAppStore();
  return themeMode === 'dark' ? darkColor : lightColor;
}

/**
 * 主题感知颜色对象
 */
export function useThemedColors() {
  const { themeMode } = useAppStore();
  const isDark = themeMode === 'dark';

  return {
    // 基础颜色
    background: isDark ? colors.backgroundDark : colors.background,
    card: isDark ? colors.cardDark : colors.card,
    text: isDark ? colors.textDark : colors.text,
    border: isDark ? colors.borderDark : colors.border,

    // 语义化颜色
    primary: colors.primary,
    primaryLight: colors.primaryLight,
    primaryDark: colors.primaryDark,
    secondary: colors.secondary,
    muted: colors.muted,
    dark: colors.dark,
    white: colors.white,

    // Gray 系列
    gray100: colors.gray100,
    gray200: colors.gray200,
    gray300: colors.gray300,
    gray400: colors.gray400,
    gray500: colors.gray500,
    gray600: colors.gray600,
    gray700: colors.gray700,
    gray800: colors.gray800,
    gray900: colors.gray900,
  };
}
