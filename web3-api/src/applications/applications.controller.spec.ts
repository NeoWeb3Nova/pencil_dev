import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationStatus } from '@prisma/client';

describe('ApplicationsController', () => {
  let applicationsController: ApplicationsController;
  let applicationsService: ApplicationsService;

  const mockApplicationsService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    findAllByJob: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  const mockApplication = {
    id: '1',
    jobId: 'job1',
    userId: 'user1',
    coverLetter: 'I am interested in this position',
    resumeUrl: 'https://example.com/resume.pdf',
    status: ApplicationStatus.PENDING,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        { provide: ApplicationsService, useValue: mockApplicationsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    applicationsController = module.get<ApplicationsController>(ApplicationsController);
    applicationsService = module.get<ApplicationsService>(ApplicationsService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createApplicationDto = {
      jobId: 'job1',
      coverLetter: 'I am interested in this position',
      resumeUrl: 'https://example.com/resume.pdf',
    };

    it('should create a new application', async () => {
      const mockReq = { user: { userId: 'user1' } };

      mockApplicationsService.create.mockResolvedValue(mockApplication);

      const result = await applicationsController.create(
        mockReq as any,
        createApplicationDto,
      );

      expect(applicationsService.create).toHaveBeenCalledWith(
        'user1',
        createApplicationDto,
      );
      expect(result).toEqual({
        success: true,
        data: mockApplication,
      });
    });
  });

  describe('findAllByUser', () => {
    it('should return paginated applications for the authenticated user', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const mockResult = {
        data: [mockApplication],
        metadata: { total: 5, page: 1, limit: 10, totalPages: 1 },
      };

      mockApplicationsService.findAllByUser.mockResolvedValue(mockResult);

      const result = await applicationsController.findAllByUser(
        mockReq as any,
        1,
        10,
      );

      expect(applicationsService.findAllByUser).toHaveBeenCalledWith(
        'user1',
        1,
        10,
      );
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

      mockApplicationsService.findAllByUser.mockResolvedValue(mockResult);

      await applicationsController.findAllByUser(mockReq as any);

      expect(applicationsService.findAllByUser).toHaveBeenCalledWith(
        'user1',
        1,
        10,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single application', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const mockResult = {
        id: '1',
        jobId: 'job1',
        userId: 'user1',
        coverLetter: 'I am interested',
      };

      mockApplicationsService.findOne.mockResolvedValue(mockResult);

      const result = await applicationsController.findOne('1', mockReq as any);

      expect(applicationsService.findOne).toHaveBeenCalledWith('1', 'user1');
      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
    });
  });

  describe('findAllByJob', () => {
    it('should return paginated applications for a job', async () => {
      const mockResult = {
        data: [
          {
            ...mockApplication,
            user: { id: 'user1', name: 'User 1', email: 'user1@example.com' },
          },
        ],
        metadata: { total: 3, page: 1, limit: 10, totalPages: 1 },
      };

      mockApplicationsService.findAllByJob.mockResolvedValue(mockResult);

      const result = await applicationsController.findAllByJob(
        'job1',
        {} as any,
        1,
        10,
      );

      expect(applicationsService.findAllByJob).toHaveBeenCalledWith(
        'job1',
        1,
        10,
      );
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

      mockApplicationsService.findAllByJob.mockResolvedValue(mockResult);

      await applicationsController.findAllByJob('job1', {} as any);

      expect(applicationsService.findAllByJob).toHaveBeenCalledWith(
        'job1',
        1,
        10,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update application status', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const body = { status: ApplicationStatus.ACCEPTED };
      const updatedApplication = {
        ...mockApplication,
        status: ApplicationStatus.ACCEPTED,
      };

      mockApplicationsService.updateStatus.mockResolvedValue(updatedApplication);

      const result = await applicationsController.updateStatus(
        '1',
        body,
        mockReq as any,
      );

      expect(applicationsService.updateStatus).toHaveBeenCalledWith(
        '1',
        ApplicationStatus.ACCEPTED,
        'user1',
      );
      expect(result).toEqual({
        success: true,
        data: updatedApplication,
      });
    });
  });
});
