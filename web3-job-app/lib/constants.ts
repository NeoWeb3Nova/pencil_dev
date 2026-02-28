// 设计令牌 - 从 Pencil 设计提取
import { Job, Message, UserProfile } from '@/types';

export const colors = {
  primary: '#6366F1',
  primaryLight: '#C7D2FE',
  primaryDark: '#4F46E5',
  dark: '#18181B',
  secondary: '#71717A',
  muted: '#A1A1AA',
  border: '#E4E4E7',
  borderDark: '#3F3F46',
  background: '#FAFAFA',
  backgroundDark: '#18181B',
  card: '#FFFFFF',
  cardDark: '#27272A',
  text: '#18181B',
  textDark: '#F4F4F5',
  white: '#FFFFFF',
  gray100: '#F4F4F5',
  gray200: '#E4E4E7',
  gray300: '#D4D4D8',
  gray400: '#A1A1AA',
  gray500: '#71717A',
  gray600: '#52525B',
  gray700: '#3F3F46',
  gray800: '#27272A',
  gray900: '#18181B',
  // 语义化颜色
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
};

// 深色模式颜色映射
export const darkColors = {
  border: colors.borderDark,
  background: colors.backgroundDark,
  card: colors.cardDark,
  text: colors.textDark,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
};

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// 模拟数据
export const mockJobs: Job[] = [
  {
    id: '1',
    title: '高级 Solidity 工程师',
    company: '以太坊基金会',
    location: '远程',
    salary: '$120-180K/年',
    salaryMin: 120000,
    salaryMax: 180000,
    description: '加入我们，一起构建去中心化的未来。我们将开发区块链基础设施和智能合约解决方案。',
    requirements: [
      '3+ 年 Solidity 开发经验',
      '深入理解 DeFi 协议',
      '熟悉 Hardhat 和 Foundry 开发工具',
    ],
    skills: ['Solidity', 'Web3.js', 'DeFi', 'Ethereum'],
    type: 'full-time',
    postedAt: '2 天前',
  },
  {
    id: '2',
    title: '前端工程师',
    company: 'Uniswap',
    location: '远程',
    salary: '$80-120K/年',
    salaryMin: 80000,
    salaryMax: 120000,
    description: '构建世界领先的去中心化交易所界面。',
    requirements: [
      '3+ 年 React 开发经验',
      '熟悉 Web3 集成',
      '有 DeFi 项目经验',
    ],
    skills: ['React', 'TypeScript', 'Web3', 'DeFi'],
    type: 'full-time',
    postedAt: '1 天前',
  },
  {
    id: '3',
    title: '智能合约审计师',
    company: 'OpenZeppelin',
    location: '远程',
    salary: '$150-200K/年',
    salaryMin: 150000,
    salaryMax: 200000,
    description: '负责审计智能合约代码，发现安全漏洞。',
    requirements: [
      '5+ 年智能合约开发经验',
      '熟悉常见安全漏洞',
      '有审计经验者优先',
    ],
    skills: ['Solidity', 'Security', 'Auditing', 'DeFi'],
    type: 'full-time',
    postedAt: '3 天前',
  },
  {
    id: '4',
    title: '区块链后端工程师',
    company: 'Coinbase',
    location: '上海/远程',
    salary: '$100-150K/年',
    salaryMin: 100000,
    salaryMax: 150000,
    description: '构建可扩展的区块链基础设施服务。',
    requirements: [
      '熟悉区块链 API 开发',
      '有高并发系统经验',
      '熟悉 Go 或 Rust',
    ],
    skills: ['Go', 'Rust', 'Blockchain', 'API'],
    type: 'full-time',
    postedAt: '5 天前',
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    company: 'Ethereum Foundation',
    companyInitial: 'EF',
    lastMessage: '感谢您的申请，我们想要...',
    timestamp: '2 小时前',
    unread: true,
    avatarColor: colors.primary,
  },
  {
    id: '2',
    company: 'Uniswap Labs',
    companyInitial: 'U',
    lastMessage: '我们对您的印象很深刻，想要安排...',
    timestamp: '1 天前',
    unread: true,
    avatarColor: colors.gray200,
  },
  {
    id: '3',
    company: 'Aave',
    companyInitial: 'A',
    lastMessage: '您的申请已收到，正在审核中。',
    timestamp: '3 天前',
    unread: false,
    avatarColor: colors.gray200,
  },
  {
    id: '4',
    company: 'Coinbase',
    companyInitial: 'C',
    lastMessage: '您好！我们注意到您申请了高级工程师职位...',
    timestamp: '1 周前',
    unread: false,
    avatarColor: colors.gray200,
  },
];

export const mockProfile: UserProfile = {
  name: 'Alex Chen',
  email: 'alex@web3dev.io',
  stats: {
    applied: 12,
    interviews: 5,
    offers: 2,
  },
};
