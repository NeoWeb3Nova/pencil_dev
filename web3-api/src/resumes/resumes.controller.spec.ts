import { Test, TestingModule } from '@nestjs/testing';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('ResumesController', () => {
  let resumesController: ResumesController;
  let resumesService: ResumesService;

  const mockResumesService = {
    findMyResume: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findPublicResume: jest.fn(),
    findAll: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumesController],
      providers: [
        { provide: ResumesService, useValue: mockResumesService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    resumesController = module.get<ResumesController>(ResumesController);
    resumesService = module.get<ResumesService>(ResumesService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findMyResume', () => {
    it('should return the authenticated user resume', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const mockResume = {
        id: '1',
        userId: 'user1',
        fullName: 'John Doe',
        email: 'john@example.com',
      };

      mockResumesService.findMyResume.mockResolvedValue(mockResume);

      const result = await resumesController.findMyResume(mockReq as any);

      expect(resumesService.findMyResume).toHaveBeenCalledWith('user1');
      expect(result).toEqual({
        success: true,
        data: mockResume,
      });
    });
  });

  describe('create', () => {
    it('should create a new resume', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const createResumeDto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        skills: ['TypeScript'],
      };
      const createdResume = { id: '1', ...createResumeDto };

      mockResumesService.create.mockResolvedValue(createdResume);

      const result = await resumesController.create(mockReq as any, createResumeDto);

      expect(resumesService.create).toHaveBeenCalledWith('user1', createResumeDto);
      expect(result).toEqual({
        success: true,
        data: createdResume,
      });
    });
  });

  describe('update', () => {
    it('should update the authenticated user resume', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const updateResumeDto = { title: 'Senior Developer' };
      const updatedResume = {
        id: '1',
        userId: 'user1',
        fullName: 'John Doe',
        ...updateResumeDto,
      };

      mockResumesService.update.mockResolvedValue(updatedResume);

      const result = await resumesController.update(mockReq as any, updateResumeDto);

      expect(resumesService.update).toHaveBeenCalledWith('user1', updateResumeDto);
      expect(result).toEqual({
        success: true,
        data: updatedResume,
      });
    });
  });

  describe('delete', () => {
    it('should delete the authenticated user resume', async () => {
      const mockReq = { user: { userId: 'user1' } };

      mockResumesService.delete.mockResolvedValue({ success: true });

      const result = await resumesController.delete(mockReq as any);

      expect(resumesService.delete).toHaveBeenCalledWith('user1');
      expect(result).toEqual({
        success: true,
        data: null,
      });
    });
  });

  describe('getPublicResume', () => {
    it('should return a public resume', async () => {
      const mockResume = {
        id: '1',
        userId: 'user1',
        fullName: 'John Doe',
        isPublic: true,
      };

      mockResumesService.findPublicResume.mockResolvedValue(mockResume);

      const result = await resumesController.getPublicResume('user1');

      expect(resumesService.findPublicResume).toHaveBeenCalledWith('user1');
      expect(result).toEqual({
        success: true,
        data: mockResume,
      });
    });

    it('should return error if resume not found or not public', async () => {
      mockResumesService.findPublicResume.mockResolvedValue(null);

      const result = await resumesController.getPublicResume('user1');

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Resume not found or not public',
      });
    });
  });

  describe('getMyResumeWithInfo', () => {
    it('should return resume with user info', async () => {
      const mockReq = { user: { userId: 'user1', email: 'john@example.com', name: 'John Doe' } };
      const mockResume = {
        id: '1',
        userId: 'user1',
        fullName: 'John Doe',
        email: 'john@example.com',
      };

      mockResumesService.findMyResume.mockResolvedValue(mockResume);

      const result = await resumesController.getMyResumeWithInfo(mockReq as any);

      expect(resumesService.findMyResume).toHaveBeenCalledWith('user1');
      expect(result).toEqual({
        success: true,
        data: mockResume,
        user: {
          id: 'user1',
          email: 'john@example.com',
          name: 'John Doe',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all resumes for admin user', async () => {
      const mockReq = { user: { userId: 'admin1', role: 'ADMIN' } };
      const mockResult = {
        data: [{ id: '1', userId: 'user1', fullName: 'John Doe' }],
        metadata: { total: 10, page: 1, limit: 10, totalPages: 1 },
      };

      mockResumesService.findAll.mockResolvedValue(mockResult);

      const result = await resumesController.findAll(1, 10, mockReq as any);

      expect(resumesService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        success: true,
        ...mockResult,
      });
    });

    it('should return error for non-admin user', async () => {
      const mockReq = { user: { userId: 'user1', role: 'USER' } };

      const result = await resumesController.findAll(1, 10, mockReq as any);

      expect(resumesService.findAll).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Admin access required',
      });
    });
  });
});
