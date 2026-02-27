import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { Job } from '@/types';

// 获取职位列表
export function useJobs(category?: string, search?: string) {
  return useQuery({
    queryKey: ['jobs', category, search],
    queryFn: () => api.getJobs(category, search),
    select: (data) => data.data,
  });
}

// 获取职位详情
export function useJob(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => api.getJobById(jobId),
    select: (data) => data.data,
    enabled: !!jobId,
  });
}

// 申请职位
export function useApplyJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => api.applyForJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

// 获取消息
export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => api.getMessages(),
    select: (data) => data.data,
  });
}

// 获取用户资料
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
    select: (data) => data.data,
  });
}

// 发布职位
export function usePostJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Job>) => api.postJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}
