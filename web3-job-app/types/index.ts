// 职位类型定义
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements: string[];
  skills: string[];
  logo?: string;
  type: 'full-time' | 'contract' | 'part-time';
  postedAt: string;
}

// 消息类型定义
export interface Message {
  id: string;
  company: string;
  companyInitial: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  avatarColor?: string;
}

// 用户类型定义
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  stats: {
    applied: number;
    interviews: number;
    offers: number;
  };
}

// 导航类型
export type TabStackParamList = {
  index: undefined;
  jobs: undefined;
  post: undefined;
  messages: undefined;
  profile: undefined;
};

export type JobStackParamList = {
  detail: { jobId: string };
};

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
