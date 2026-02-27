import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../database/prisma.service';
import { ApplicationStatus } from '@prisma/client';

describe('ApplicationsService', () => {
  let applicationsService: ApplicationsService;
  let prismaService: PrismaService;

  const mockApplication = {
    id: '1',
    jobId: 'job1',
    userId: 'user1',
    coverLetter: 'I am interested in this position',
    resumeUrl: 'https://example.com/resume.pdf',
    status: ApplicationStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    application: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    applicationsService = module.get<ApplicationsService>(ApplicationsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createApplicationDto = {
      jobId: 'job1',
      coverLetter: 'I am interested in this position',
      resumeUrl: 'https://example.com/resume.pdf',
    };

    it('should create a new application successfully', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue(null);
      mockPrismaService.application.create.mockResolvedValue(mockApplication);

      const result = await applicationsService.create('user1', createApplicationDto);

      expect(prismaService.application.findUnique).toHaveBeenCalledWith({
        where: {
          jobId_userId: {
            jobId: 'job1',
            userId: 'user1',
          },
        },
      });
      expect(prismaService.application.create).toHaveBeenCalledWith({
        data: {
          jobId: 'job1',
          userId: 'user1',
          coverLetter: 'I am interested in this position',
          resumeUrl: 'https://example.com/resume.pdf',
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
            },
          },
        },
      });
      expect(result).toEqual(mockApplication);
    });

    it('should throw BadRequestException if user already applied', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue(mockApplication);

      await expect(
        applicationsService.create('user1', createApplicationDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        applicationsService.create('user1', createApplicationDto),
      ).rejects.toThrow('You have already applied to this job');
    });
  });

  describe('findAllByUser', () => {
    it('should return paginated applications for a user', async () => {
      const applications = [mockApplication];
      const total = 5;

      mockPrismaService.application.findMany.mockResolvedValue(applications);
      mockPrismaService.application.count.mockResolvedValue(total);

      const result = await applicationsService.findAllByUser('user1', 1, 10);

      expect(prismaService.application.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true,
              type: true,
            },
          },
        },
      });
      expect(result).toEqual({
        data: applications,
        metadata: {
          total,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should use default pagination values', async () => {
      mockPrismaService.application.findMany.mockResolvedValue([]);
      mockPrismaService.application.count.mockResolvedValue(0);

      const result = await applicationsService.findAllByUser('user1');

      expect(result.data).toEqual([]);
      expect(result.metadata.total).toBe(0);
    });

    it('should return empty array when user has no applications', async () => {
      mockPrismaService.application.findMany.mockResolvedValue([]);
      mockPrismaService.application.count.mockResolvedValue(0);

      const result = await applicationsService.findAllByUser('user1', 1, 10);

      expect(result.data).toEqual([]);
      expect(result.metadata.total).toBe(0);
      expect(result.metadata.totalPages).toBe(0);
    });
  });

  describe('findAllByJob', () => {
    it('should return paginated applications for a job', async () => {
      const applications = [
        {
          ...mockApplication,
          user: { id: 'user1', name: 'User 1', email: 'user1@example.com' },
        },
      ];
      const total = 3;

      mockPrismaService.application.findMany.mockResolvedValue(applications);
      mockPrismaService.application.count.mockResolvedValue(total);

      const result = await applicationsService.findAllByJob('job1', 1, 10);

      expect(prismaService.application.findMany).toHaveBeenCalledWith({
        where: { jobId: 'job1' },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual({
        data: applications,
        metadata: {
          total,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should use default pagination values', async () => {
      mockPrismaService.application.findMany.mockResolvedValue([]);
      mockPrismaService.application.count.mockResolvedValue(0);

      const result = await applicationsService.findAllByJob('job1');

      expect(result.data).toEqual([]);
      expect(result.metadata.total).toBe(0);
    });
  });

  describe('updateStatus', () => {
    it('should update application status successfully', async () => {
      const applicationWithJob = {
        ...mockApplication,
        job: { id: 'job1', postedById: 'user1' },
      };
      const updatedApplication = {
        ...mockApplication,
        status: ApplicationStatus.ACCEPTED,
        user: { id: 'user1', name: 'User 1', email: 'user1@example.com' },
      };

      mockPrismaService.application.findUnique.mockResolvedValue(applicationWithJob);
      mockPrismaService.application.update.mockResolvedValue(updatedApplication);

      const result = await applicationsService.updateStatus(
        'app1',
        ApplicationStatus.ACCEPTED,
        'user1',
      );

      expect(prismaService.application.findUnique).toHaveBeenCalledWith({
        where: { id: 'app1' },
        include: { job: true },
      });
      expect(prismaService.application.update).toHaveBeenCalledWith({
        where: { id: 'app1' },
        data: { status: ApplicationStatus.ACCEPTED },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(updatedApplication);
    });

    it('should throw NotFoundException if application not found', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue(null);

      await expect(
        applicationsService.updateStatus('nonexistent', ApplicationStatus.ACCEPTED, 'user1'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        applicationsService.updateStatus('nonexistent', ApplicationStatus.ACCEPTED, 'user1'),
      ).rejects.toThrow('Application not found');
    });

    it('should throw NotFoundException if user is not job owner', async () => {
      const applicationWithJob = {
        ...mockApplication,
        job: { id: 'job1', postedById: 'user2' },
      };

      mockPrismaService.application.findUnique.mockResolvedValue(applicationWithJob);

      await expect(
        applicationsService.updateStatus('app1', ApplicationStatus.ACCEPTED, 'user1'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        applicationsService.updateStatus('app1', ApplicationStatus.ACCEPTED, 'user1'),
      ).rejects.toThrow('Access denied');
    });
  });

  describe('findOne', () => {
    it('should return a single application', async () => {
      const applicationWithRelations = {
        ...mockApplication,
        job: { id: 'job1', title: 'Job 1' },
        user: { id: 'user1', name: 'User 1', email: 'user1@example.com' },
      };

      mockPrismaService.application.findUnique.mockResolvedValue(applicationWithRelations);

      const result = await applicationsService.findOne('app1', 'user1');

      expect(prismaService.application.findUnique).toHaveBeenCalledWith({
        where: { id: 'app1' },
        include: {
          job: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(applicationWithRelations);
    });

    it('should throw NotFoundException if application not found', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue(null);

      await expect(applicationsService.findOne('nonexistent', 'user1')).rejects.toThrow(
        NotFoundException,
      );
      await expect(applicationsService.findOne('nonexistent', 'user1')).rejects.toThrow(
        'Application not found',
      );
    });

    it('should throw NotFoundException if user is not applicant or job owner', async () => {
      const applicationWithRelations = {
        ...mockApplication,
        userId: 'user2',
        job: { id: 'job1', postedById: 'user3' },
      };

      mockPrismaService.application.findUnique.mockResolvedValue(applicationWithRelations);

      await expect(applicationsService.findOne('app1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
      await expect(applicationsService.findOne('app1', 'user1')).rejects.toThrow(
        'Access denied',
      );
    });
  });
});
