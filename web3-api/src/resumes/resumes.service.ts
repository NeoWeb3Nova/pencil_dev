import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto';

@Injectable()
export class ResumesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new resume for a user
   */
  async create(userId: string, createResumeDto: CreateResumeDto) {
    // Check if user already has a resume
    const existingResume = await this.prisma.resume.findUnique({
      where: { userId },
    });

    if (existingResume) {
      throw new ForbiddenException('User already has a resume. Use update instead.');
    }

    return this.prisma.resume.create({
      data: {
        userId,
        ...createResumeDto,
        skills: createResumeDto.skills || [],
      },
    });
  }

  /**
   * Update an existing resume
   */
  async update(userId: string, updateResumeDto: UpdateResumeDto) {
    // Check if resume exists
    const existingResume = await this.prisma.resume.findUnique({
      where: { userId },
    });

    if (!existingResume) {
      throw new NotFoundException('Resume not found. Create one first.');
    }

    return this.prisma.resume.update({
      where: { userId },
      data: updateResumeDto,
    });
  }

  /**
   * Get resume by user ID
   */
  async findByUserId(userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { userId },
    });

    return resume;
  }

  /**
   * Get my own resume
   */
  async findMyResume(userId: string) {
    return this.findByUserId(userId);
  }

  /**
   * Get public resume (for sharing)
   */
  async findPublicResume(userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { userId },
    });

    if (!resume) {
      return null;
    }

    if (!resume.isPublic) {
      return null;
    }

    // Update last viewed timestamp
    await this.prisma.resume.update({
      where: { userId },
      data: { lastViewedAt: new Date() },
    });

    return resume;
  }

  /**
   * Delete a resume
   */
  async delete(userId: string) {
    const existingResume = await this.prisma.resume.findUnique({
      where: { userId },
    });

    if (!existingResume) {
      throw new NotFoundException('Resume not found');
    }

    await this.prisma.resume.delete({
      where: { userId },
    });

    return { success: true };
  }

  /**
   * Get all resumes (admin only)
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [resumes, total] = await Promise.all([
      this.prisma.resume.findMany({
        skip,
        take: limit,
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
      }),
      this.prisma.resume.count(),
    ]);

    return {
      data: resumes,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Verify ownership of a resume
   */
  verifyOwnership(resume: any, userId: string, userRole: string) {
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    if (resume.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to access this resume');
    }
  }
}
