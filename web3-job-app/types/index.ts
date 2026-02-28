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
  status?: 'draft' | 'published' | 'closed';
  postedBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
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

// 认证相关类型
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

// 申请类型
export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  resumeUrl?: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
  job?: Job;
}

export interface CreateApplicationRequest {
  jobId: string;
  resumeUrl?: string;
  coverLetter?: string;
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
    totalPages?: number;
  };
}

// ============================================
// Resume Types
// ============================================

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Education {
  school: string;
  degree?: string;
  field?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface Project {
  name: string;
  description: string;
  url?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate?: string;
  expireDate?: string;
  credentialId?: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface Resume {
  id: string;
  userId: string;
  fullName: string;
  title?: string;
  summary?: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  experiences?: Experience[];
  education?: Education[];
  skills: string[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  isPublic: boolean;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeRequest {
  fullName: string;
  title?: string;
  summary?: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  experiences?: Experience[];
  education?: Education[];
  skills?: string[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  isPublic?: boolean;
}

export interface UpdateResumeRequest {
  fullName?: string;
  title?: string;
  summary?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  experiences?: Experience[];
  education?: Education[];
  skills?: string[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  isPublic?: boolean;
}
