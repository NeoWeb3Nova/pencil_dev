import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PrismaService } from '../database/prisma.service';
import { JobType, JobStatus } from '@prisma/client';

describe('JobsService', () => {
  let jobsService: JobsService;
  let prismaService: PrismaService;

  const mockJob = {
    id: '1',
    title: 'Senior Developer',
    company: 'Tech Corp',
    location: 'Remote',
    salaryMin: 100000,
    salaryMax: 150000,
    description: 'We are hiring',
    requirements: ['5+ years experience'],
    skills: ['TypeScript', 'Node.js'],
    type: JobType.FULL_TIME,
    status: JobStatus.PUBLISHED,
    postedById: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    job: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    jobsService = module.get<JobsService>(JobsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated jobs with metadata', async () => {
      const jobs = [mockJob];
      const total = 50;

      mockPrismaService.job.findMany.mockResolvedValue(jobs);
      mockPrismaService.job.count.mockResolvedValue(total);

      const result = await jobsService.findAll(1, 10);

      expect(prismaService.job.findMany).toHaveBeenCalledWith({
        where: { status: JobStatus.PUBLISHED },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          postedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });
      expect(result).toEqual({
        data: jobs,
        metadata: {
          total,
          page: 1,
          limit: 10,
          totalPages: 5,
        },
      });
    });

    it('should filter by search term', async () => {
      mockPrismaService.job.findMany.mockResolvedValue([]);
      mockPrismaService.job.count.mockResolvedValue(0);

      await jobsService.findAll(1, 10, 'developer');

      expect(prismaService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ title: expect.any(Object) }),
              expect.objectContaining({ company: expect.any(Object) }),
              expect.objectContaining({ skills: expect.any(Object) }),
            ]),
          }),
        }),
      );
    });

    it('should filter by job type', async () => {
      mockPrismaService.job.findMany.mockResolvedValue([]);
      mockPrismaService.job.count.mockResolvedValue(0);

      await jobsService.findAll(1, 10, undefined, JobType.FULL_TIME);

      expect(prismaService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: JobStatus.PUBLISHED,
            type: JobType.FULL_TIME,
          }),
        }),
      );
    });

    it('should filter by status when provided', async () => {
      mockPrismaService.job.findMany.mockResolvedValue([]);
      mockPrismaService.job.count.mockResolvedValue(0);

      await jobsService.findAll(1, 10, undefined, undefined, JobStatus.DRAFT);

      expect(prismaService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: JobStatus.DRAFT,
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a job by id', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);

      const result = await jobsService.findOne('1');

      expect(prismaService.job.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          postedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });
      expect(result).toEqual(mockJob);
    });

    it('should throw NotFoundException when job not found', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(jobsService.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(jobsService.findOne('nonexistent')).rejects.toThrow(
        'Job not found',
      );
    });
  });

  describe('create', () => {
    const createJobDto = {
      title: 'New Job',
      company: 'Startup Inc',
      location: 'Remote',
      description: 'Job description',
    };

    it('should create a new job', async () => {
      const createdJob = { ...mockJob, ...createJobDto };
      mockPrismaService.job.create.mockResolvedValue(createdJob);

      const result = await jobsService.create('user1', createJobDto);

      expect(prismaService.job.create).toHaveBeenCalledWith({
        data: {
          ...createJobDto,
          postedById: 'user1',
        },
        include: {
          postedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });
      expect(result).toEqual(createdJob);
    });
  });

  describe('update', () => {
    const updateJobDto = {
      title: 'Updated Title',
      salaryMax: 160000,
    };

    it('should update an existing job', async () => {
      const updatedJob = { ...mockJob, ...updateJobDto };
      mockPrismaService.job.update.mockResolvedValue(updatedJob);

      const result = await jobsService.update('1', updateJobDto);

      expect(prismaService.job.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateJobDto,
        include: {
          postedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });
      expect(result).toEqual(updatedJob);
    });

    it('should throw NotFoundException when updating non-existent job', async () => {
      mockPrismaService.job.update.mockRejectedValue(
        new NotFoundException('Job not found'),
      );

      await expect(jobsService.update('nonexistent', updateJobDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a job', async () => {
      mockPrismaService.job.delete.mockResolvedValue(mockJob);

      const result = await jobsService.delete('1');

      expect(prismaService.job.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe('findByUser', () => {
    it('should return paginated jobs for a user', async () => {
      const jobs = [mockJob];
      const total = 5;

      mockPrismaService.job.findMany.mockResolvedValue(jobs);
      mockPrismaService.job.count.mockResolvedValue(total);

      const result = await jobsService.findByUser('user1', 1, 10);

      expect(prismaService.job.findMany).toHaveBeenCalledWith({
        where: { postedById: 'user1' },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual({
        data: jobs,
        metadata: {
          total,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should return empty array when user has no jobs', async () => {
      mockPrismaService.job.findMany.mockResolvedValue([]);
      mockPrismaService.job.count.mockResolvedValue(0);

      const result = await jobsService.findByUser('user1');

      expect(result.data).toEqual([]);
      expect(result.metadata.total).toBe(0);
    });
  });
});
