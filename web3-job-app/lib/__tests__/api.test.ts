import 'reflect-metadata';
import { postJob } from '../api';

// Mock fetch
global.fetch = jest.fn();

describe('API - postJob', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    (global as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  });

  it('should successfully post a job', async () => {
    const mockJobData = {
      title: 'Senior Solidity Engineer',
      company: 'Ethereum Foundation',
      location: 'Remote',
      salaryMin: 80000,
      salaryMax: 120000,
      description: 'We are looking for a talented Solidity engineer.',
      skills: ['Solidity', 'Web3.js'],
      type: 'full-time',
    };

    const mockResponse = {
      success: true,
      data: { id: 'job-123' },
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await postJob(mockJobData);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 'job-123' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/jobs',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer undefined',
        }),
      })
    );
  });

  it('should map job type from frontend to backend enum', async () => {
    const mockJobData = {
      title: 'Developer',
      company: 'Test Corp',
      location: 'Remote',
      type: 'full-time',
      description: 'Test job',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { id: '1' } }),
    });

    await postJob(mockJobData);

    const callArgs = (fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(callArgs[1].body as string);
    expect(body.type).toBe('FULL_TIME');
  });

  it('should handle network errors', async () => {
    const mockJobData = {
      title: 'Developer',
      company: 'Test Corp',
      location: 'Remote',
      description: 'Test job',
    };

    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await postJob(mockJobData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('should handle API errors', async () => {
    const mockJobData = {
      title: 'Developer',
      company: 'Test Corp',
      location: 'Remote',
      description: 'Test job',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Validation failed',
      }),
    });

    const result = await postJob(mockJobData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Validation failed');
  });

  it('should use default FULL_TIME type when not provided', async () => {
    const mockJobData = {
      title: 'Developer',
      company: 'Test Corp',
      location: 'Remote',
      description: 'Test job',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { id: '1' } }),
    });

    await postJob(mockJobData);

    const callArgs = (fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(callArgs[1].body as string);
    expect(body.type).toBe('FULL_TIME');
  });
});
