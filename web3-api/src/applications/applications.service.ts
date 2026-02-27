import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/application.dto';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createApplicationDto: CreateApplicationDto) {
    const { jobId, ...data } = createApplicationDto;

    // Check if already applied
    const existing = await this.prisma.application.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('You have already applied to this job');
    }

    return this.prisma.application.create({
      data: {
        jobId,
        userId,
        ...data,
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
  }

  async findAllByUser(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { userId },
        skip,
        take: limit,
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
      }),
      this.prisma.application.count({ where: { userId } }),
    ]);

    return {
      data: applications,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllByJob(jobId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { jobId },
        skip,
        take: limit,
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
      }),
      this.prisma.application.count({ where: { jobId } }),
    ]);

    return {
      data: applications,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(
    applicationId: string,
    status: ApplicationStatus,
    userId: string,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check if user is the job owner or admin
    if (application.job.postedById !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { status },
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
  }

  async findOne(applicationId: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
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

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check access
    if (
      application.userId !== userId &&
      application.job.postedById !== userId
    ) {
      throw new NotFoundException('Access denied');
    }

    return application;
  }
}
