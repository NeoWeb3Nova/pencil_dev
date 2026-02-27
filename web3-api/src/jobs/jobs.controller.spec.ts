import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JobType, JobStatus } from '@prisma/client';

describe('JobsController', () => {
  let jobsController: JobsController;
  let jobsService: JobsService;

  const mockJobsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByUser: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        { provide: JobsService, useValue: mockJobsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    jobsController = module.get<JobsController>(JobsController);
    jobsService = module.get<JobsService>(JobsService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated jobs', async () => {
      const mockResult = {
        data: [{ id: '1', title: 'Job 1' }],
        metadata: { total: 10, page: 1, limit: 10, totalPages: 1 },
      };

      mockJobsService.findAll.mockResolvedValue(mockResult);

      const result = await jobsController.findAll(1, 10);

      expect(jobsService.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined);
      expect(result).toEqual({
        success: true,
        ...mockResult,
      });
    });

    it('should use default pagination values', async () => {
      const mockResult = {
        data: [],
        metadata: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };

      mockJobsService.findAll.mockResolvedValue(mockResult);

      await jobsController.findAll();

      expect(jobsService.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined);
    });

    it('should pass search, type, and status filters', async () => {
      const mockResult = {
        data: [],
        metadata: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };

      mockJobsService.findAll.mockResolvedValue(mockResult);

      await jobsController.findAll(
        1,
        10,
        'developer',
        JobType.FULL_TIME,
        JobStatus.PUBLISHED,
      );

      expect(jobsService.findAll).toHaveBeenCalledWith(
        1,
        10,
        'developer',
        JobType.FULL_TIME,
        JobStatus.PUBLISHED,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single job', async () => {
      const mockJob = { id: '1', title: 'Job 1', company: 'Tech Corp' };

      mockJobsService.findOne.mockResolvedValue(mockJob);

      const result = await jobsController.findOne('1');

      expect(jobsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        success: true,
        data: mockJob,
      });
    });
  });

  describe('create', () => {
    it('should create a new job', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const createJobDto = {
        title: 'New Job',
        company: 'Startup',
        location: 'Remote',
        description: 'Description',
      };
      const createdJob = { id: '1', ...createJobDto };

      mockJobsService.create.mockResolvedValue(createdJob);

      const result = await jobsController.create(mockReq as any, createJobDto);

      expect(jobsService.create).toHaveBeenCalledWith('user1', createJobDto);
      expect(result).toEqual({
        success: true,
        data: createdJob,
      });
    });
  });

  describe('update', () => {
    it('should update a job if user owns it', async () => {
      const mockReq = { user: { userId: 'user1', role: 'user' } };
      const existingJob = { id: '1', postedById: 'user1', title: 'Old Title' };
      const updateJobDto = { title: 'New Title' };
      const updatedJob = { ...existingJob, ...updateJobDto };

      mockJobsService.findOne.mockResolvedValue(existingJob);
      mockJobsService.update.mockResolvedValue(updatedJob);

      const result = await jobsController.update('1', updateJobDto, mockReq as any);

      expect(jobsService.update).toHaveBeenCalledWith('1', updateJobDto);
      expect(result).toEqual({
        success: true,
        data: updatedJob,
      });
    });

    it('should update a job if user is admin', async () => {
      const mockReq = { user: { userId: 'user2', role: 'admin' } };
      const existingJob = { id: '1', postedById: 'user1', title: 'Old Title' };
      const updateJobDto = { title: 'New Title' };
      const updatedJob = { ...existingJob, ...updateJobDto };

      mockJobsService.findOne.mockResolvedValue(existingJob);
      mockJobsService.update.mockResolvedValue(updatedJob);

      const result = await jobsController.update('1', updateJobDto, mockReq as any);

      expect(jobsService.update).toHaveBeenCalledWith('1', updateJobDto);
      expect(result).toEqual({
        success: true,
        data: updatedJob,
      });
    });

    it('should return unauthorized if user does not own the job', async () => {
      const mockReq = { user: { userId: 'user2', role: 'user' } };
      const existingJob = { id: '1', postedById: 'user1', title: 'Old Title' };
      const updateJobDto = { title: 'New Title' };

      mockJobsService.findOne.mockResolvedValue(existingJob);

      const result = await jobsController.update('1', updateJobDto, mockReq as any);

      expect(jobsService.update).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Unauthorized to update this job',
      });
    });
  });

  describe('delete', () => {
    it('should delete a job if user owns it', async () => {
      const mockReq = { user: { userId: 'user1', role: 'user' } };
      const existingJob = { id: '1', postedById: 'user1' };

      mockJobsService.findOne.mockResolvedValue(existingJob);
      mockJobsService.delete.mockResolvedValue({ success: true });

      const result = await jobsController.delete('1', mockReq as any);

      expect(jobsService.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        success: true,
        data: null,
      });
    });

    it('should delete a job if user is admin', async () => {
      const mockReq = { user: { userId: 'user2', role: 'admin' } };
      const existingJob = { id: '1', postedById: 'user1' };

      mockJobsService.findOne.mockResolvedValue(existingJob);
      mockJobsService.delete.mockResolvedValue({ success: true });

      const result = await jobsController.delete('1', mockReq as any);

      expect(jobsService.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        success: true,
        data: null,
      });
    });

    it('should return unauthorized if user does not own the job', async () => {
      const mockReq = { user: { userId: 'user2', role: 'user' } };
      const existingJob = { id: '1', postedById: 'user1' };

      mockJobsService.findOne.mockResolvedValue(existingJob);

      const result = await jobsController.delete('1', mockReq as any);

      expect(jobsService.delete).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Unauthorized to delete this job',
      });
    });
  });

  describe('findByUser', () => {
    it('should return jobs for the authenticated user', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const mockResult = {
        data: [{ id: '1', title: 'My Job' }],
        metadata: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };

      mockJobsService.findByUser.mockResolvedValue(mockResult);

      const result = await jobsController.findByUser(mockReq as any, 1, 10);

      expect(jobsService.findByUser).toHaveBeenCalledWith('user1', 1, 10);
      expect(result).toEqual({
        success: true,
        ...mockResult,
      });
    });

    it('should use default pagination values', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const mockResult = {
        data: [],
        metadata: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };

      mockJobsService.findByUser.mockResolvedValue(mockResult);

      await jobsController.findByUser(mockReq as any);

      expect(jobsService.findByUser).toHaveBeenCalledWith('user1', 1, 10);
    });
  });
});
