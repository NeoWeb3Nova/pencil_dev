// API 服务 - 连接真实后端 API
// 后端地址：http://localhost:3000/api

import * as SecureStore from 'expo-secure-store';
import {
  Job,
  Message,
  UserProfile,
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  CreateApplicationRequest,
  Application,
  CreateJobRequest,
} from '@/types';

const API_BASE_URL = 'http://localhost:3000/api';

// 获取存储的 token
const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('@web3job:token');
  } catch {
    return null;
  }
};

// 存储 token
const setToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync('@web3job:token', token);
  } catch {
    // 处理错误
  }
};

// 清除 token
const clearToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('@web3job:token');
  } catch {
    // 处理错误
  }
};

// 通用请求处理
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      data: null,
      error: data.message || 'Request failed',
    };
  }

  return data;
}

// 带认证的请求
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

// ==================== 认证相关 ====================

// 登录
export async function login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await handleResponse<AuthResponse>(response);

    if (result.success && result.data) {
      await setToken(result.data.access_token);
    }

    return result;
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 注册
export async function register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await handleResponse<{ access_token: string; user: any }>(response);

    if (result.success && result.data) {
      await setToken(result.data.access_token);
    }

    return result as ApiResponse<AuthResponse>;
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 登出
export async function logout(): Promise<void> {
  await clearToken();
}

// 获取用户资料
export async function getProfile(): Promise<ApiResponse<UserProfile & { id: string; role: string }>> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/profile`);
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 更新用户资料
export async function updateProfile(data: { name: string }): Promise<ApiResponse<UserProfile>> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/profile`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// ==================== 职位相关 ====================

// 获取职位列表
export async function getJobs(
  page: number = 1,
  limit: number = 10,
  search?: string,
  type?: string,
  status?: string
): Promise<ApiResponse<Job[]>> {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (type) params.append('type', type);
    if (status) params.append('status', status);

    const response = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`);
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 获取职位详情
export async function getJobById(id: string): Promise<ApiResponse<Job>> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 发布职位
export async function postJob(data: CreateJobRequest): Promise<ApiResponse<{ id: string }>> {
  try {
    // 前端类型映射到后端枚举
    const typeMapping: Record<string, string> = {
      'full-time': 'FULL_TIME',
      'contract': 'CONTRACT',
      'part-time': 'PART_TIME',
      'freelance': 'FREELANCE',
      'internship': 'INTERNSHIP',
    };

    const jobData = {
      title: data.title,
      company: data.company,
      location: data.location,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      description: data.description,
      requirements: data.requirements,
      skills: data.skills,
      type: data.type ? typeMapping[data.type] : 'FULL_TIME',
    };

    const response = await fetchWithAuth(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 更新职位
export async function updateJob(id: string, data: Partial<Job>): Promise<ApiResponse<Job>> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 删除职位
export async function deleteJob(id: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 获取用户发布的职位
export async function getUserJobs(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<Job[]>> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/jobs/user/me?page=${page}&limit=${limit}`);
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// ==================== 申请相关 ====================

// 申请职位
export async function applyForJob(
  data: CreateApplicationRequest
): Promise<ApiResponse<Application>> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/applications`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 获取我的申请
export async function getMyApplications(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<Application[]>> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/applications/my-applications?page=${page}&limit=${limit}`
    );
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 获取申请详情
export async function getApplication(id: string): Promise<ApiResponse<Application>> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/applications/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// ==================== 消息相关 ====================

// 获取消息列表
export async function getMessages(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<Message[]>> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/messages?page=${page}&limit=${limit}`
    );
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 获取未读消息数量
export async function getUnreadMessageCount(): Promise<ApiResponse<{ count: number }>> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/messages/unread-count`);
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 发送消息
export async function sendMessage(
  jobId: string,
  receiverId: string,
  content: string
): Promise<ApiResponse<Message>> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/messages`, {
      method: 'POST',
      body: JSON.stringify({ jobId, receiverId, content }),
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// 标记消息为已读
export async function markMessageAsRead(id: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/messages/${id}/read`, {
      method: 'POST',
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      data: null,
      error: 'Network error',
    };
  }
}

// ==================== 工具函数 ====================

// 检查是否已登录
export async function isLoggedIn(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}

// 获取当前 token
export async function getCurrentToken(): Promise<string | null> {
  return await getToken();
}
