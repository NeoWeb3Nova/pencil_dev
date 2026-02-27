// API 服务 - 模拟后端 API
// 在实际项目中，这里会调用真实的后端接口

import { Job, Message, UserProfile, ApiResponse } from '@/types';
import { mockJobs, mockMessages, mockProfile } from './constants';

const API_BASE_URL = 'http://localhost:3000/api'; // 本地开发用

// 模拟网络延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 获取职位列表
export async function getJobs(
  category?: string,
  search?: string
): Promise<ApiResponse<Job[]>> {
  await delay(500); // 模拟网络延迟

  let filteredJobs = mockJobs;

  if (category && category !== 'all') {
    filteredJobs = mockJobs.filter((job) =>
      job.skills.some((skill) =>
        skill.toLowerCase().includes(category.toLowerCase())
      )
    );
  }

  if (search) {
    filteredJobs = mockJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()))
    );
  }

  return {
    success: true,
    data: filteredJobs,
    metadata: {
      total: filteredJobs.length,
      page: 1,
      limit: 10,
    },
  };
}

// 获取职位详情
export async function getJobById(id: string): Promise<ApiResponse<Job>> {
  await delay(300);

  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    return {
      success: false,
      data: null,
      error: '职位不存在',
    };
  }

  return {
    success: true,
    data: job,
  };
}

// 申请职位
export async function applyForJob(jobId: string): Promise<ApiResponse<{ success: boolean }>> {
  await delay(1000);

  return {
    success: true,
    data: { success: true },
  };
}

// 获取消息列表
export async function getMessages(): Promise<ApiResponse<Message[]>> {
  await delay(300);

  return {
    success: true,
    data: mockMessages,
  };
}

// 获取用户资料
export async function getProfile(): Promise<ApiResponse<UserProfile>> {
  await delay(300);

  return {
    success: true,
    data: mockProfile,
  };
}

// 发布职位
export async function postJob(
  data: Partial<Job>
): Promise<ApiResponse<{ jobId: string }>> {
  await delay(1000);

  if (!data.title || !data.company) {
    return {
      success: false,
      data: null,
      error: '请填写必填项',
    };
  }

  return {
    success: true,
    data: { jobId: 'new-job-id' },
  };
}

// 搜索消息
export async function searchMessages(query: string): Promise<ApiResponse<Message[]>> {
  await delay(300);

  if (!query) {
    return {
      success: true,
      data: mockMessages,
    };
  }

  const filtered = mockMessages.filter(
    (m) =>
      m.company.toLowerCase().includes(query.toLowerCase()) ||
      m.lastMessage.toLowerCase().includes(query.toLowerCase())
  );

  return {
    success: true,
    data: filtered,
  };
}
