import { type ClassValue, clsx } from 'clsx';
import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 注意：需要安装 clsx: npm install clsx
// 如果没有安装，可以简单地用这个替代：
export function cn(...inputs: unknown[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatSalary(min: number, max: number): string {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };
  return `$${formatNumber(min)}-${formatNumber(max)}`;
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小时前`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} 天前`;
  return `${Math.floor(diffInSeconds / 604800)} 周前`;
}
