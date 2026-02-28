import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { PrismaService } from '../database/prisma.service';
import { CreateResumeDto } from './dto/resume.dto';

describe('ResumesService', () => {
  let resumesService: ResumesService;
  let prismaService: PrismaService;

  const mockResume = {
    id: '1',
    userId: 'user1',
    fullName: 'John Doe',
    title: 'Senior Developer',
    summary: 'Experienced developer with 5+ years of experience',
    email: 'john@example.com',
    phone: '+1234567890',
    location: 'New York, NY',
    website: 'https://johndoe.com',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    githubUrl: 'https://github.com/johndoe',
    skills: ['TypeScript', 'Node.js', 'React'],
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    resume: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    resumesService = module.get<ResumesService>(ResumesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createResumeDto: CreateResumeDto = {
      fullName: 'John Doe',
      title: 'Senior Developer',
      email: 'john@example.com',
      skills: ['TypeScript', 'Node.js'],
    };

    it('should create a new resume', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);
      mockPrismaService.resume.create.mockResolvedValue(mockResume);

      const result = await resumesService.create('user1', createResumeDto);

      expect(prismaService.resume.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          ...createResumeDto,
          skills: ['TypeScript', 'Node.js'],
        },
      });
      expect(result).toEqual(mockResume);
    });

    it('should throw ForbiddenException when user already has a resume', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);

      await expect(resumesService.create('user1', createResumeDto)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(resumesService.create('user1', createResumeDto)).rejects.toThrow(
        'User already has a resume. Use update instead.',
      );
    });
  });

  describe('update', () => {
    const updateResumeDto = {
      title: 'Lead Developer',
      skills: ['TypeScript', 'Node.js', 'Python'],
    };

    it('should update an existing resume', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);
      mockPrismaService.resume.update.mockResolvedValue({
        ...mockResume,
        ...updateResumeDto,
      });

      const result = await resumesService.update('user1', updateResumeDto);

      expect(prismaService.resume.update).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        data: updateResumeDto,
      });
      expect(result).toEqual({ ...mockResume, ...updateResumeDto });
    });

    it('should throw NotFoundException when updating non-existent resume', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);

      await expect(resumesService.update('user1', updateResumeDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(resumesService.update('user1', updateResumeDto)).rejects.toThrow(
        'Resume not found. Create one first.',
      );
    });
  });

  describe('findByUserId', () => {
    it('should return a resume by user id', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);

      const result = await resumesService.findByUserId('user1');

      expect(prismaService.resume.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user1' },
      });
      expect(result).toEqual(mockResume);
    });

    it('should return null when resume not found', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);

      const result = await resumesService.findByUserId('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findMyResume', () => {
    it('should call findByUserId', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);

      const result = await resumesService.findMyResume('user1');

      expect(result).toEqual(mockResume);
    });
  });

  describe('findPublicResume', () => {
    it('should return resume if isPublic is true', async () => {
      const publicResume = { ...mockResume, isPublic: true };
      mockPrismaService.resume.findUnique.mockResolvedValue(publicResume);
      mockPrismaService.resume.update.mockResolvedValue(publicResume);

      const result = await resumesService.findPublicResume('user1');

      expect(result).toEqual(publicResume);
      expect(prismaService.resume.update).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        data: { lastViewedAt: expect.any(Date) },
      });
    });

    it('should return null if resume is not public', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);

      const result = await resumesService.findPublicResume('user1');

      expect(result).toBeNull();
    });

    it('should return null if resume not found', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);

      const result = await resumesService.findPublicResume('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a resume', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);
      mockPrismaService.resume.delete.mockResolvedValue(mockResume);

      const result = await resumesService.delete('user1');

      expect(prismaService.resume.delete).toHaveBeenCalledWith({
        where: { userId: 'user1' },
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException when deleting non-existent resume', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);

      await expect(resumesService.delete('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(resumesService.delete('nonexistent')).rejects.toThrow(
        'Resume not found',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated resumes with metadata', async () => {
      const resumes = [mockResume];
      const total = 50;

      mockPrismaService.resume.findMany.mockResolvedValue(resumes);
      mockPrismaService.resume.count.mockResolvedValue(total);

      const result = await resumesService.findAll(1, 10);

      expect(prismaService.resume.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { updatedAt: 'desc' },
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
        data: resumes,
        metadata: {
          total,
          page: 1,
          limit: 10,
          totalPages: 5,
        },
      });
    });
  });

  describe('verifyOwnership', () => {
    it('should not throw when user owns the resume', () => {
      const resume = { userId: 'user1' };
      expect(() =>
        resumesService.verifyOwnership(resume, 'user1', 'USER'),
      ).not.toThrow();
    });

    it('should not throw when user is admin', () => {
      const resume = { userId: 'user1' };
      expect(() =>
        resumesService.verifyOwnership(resume, 'user2', 'ADMIN'),
      ).not.toThrow();
    });

    it('should throw ForbiddenException when user does not own the resume', () => {
      const resume = { userId: 'user1' };
      expect(() =>
        resumesService.verifyOwnership(resume, 'user2', 'USER'),
      ).toThrow(ForbiddenException);
      expect(() =>
        resumesService.verifyOwnership(resume, 'user2', 'USER'),
      ).toThrow('You do not have permission to access this resume');
    });

    it('should throw NotFoundException when resume is null', () => {
      expect(() =>
        resumesService.verifyOwnership(null, 'user1', 'USER'),
      ).toThrow(NotFoundException);
      expect(() =>
        resumesService.verifyOwnership(null, 'user1', 'USER'),
      ).toThrow('Resume not found');
    });
  });
});
