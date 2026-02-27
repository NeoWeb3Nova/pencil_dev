import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { JobType, JobStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    type?: JobType,
    status?: JobStatus,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    // Only show published jobs for regular queries
    if (!status) {
      where.status = JobStatus.published;
    } else {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { skills: { has: search } },
      ];
    }

    if (type) {
      where.type = type;
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          postedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        postedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async create(userId: string, createJobDto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        ...createJobDto,
        postedById: userId,
      },
      include: {
        postedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const job = await this.prisma.job.update({
      where: { id },
      data: updateJobDto,
      include: {
        postedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async delete(id: string) {
    await this.prisma.job.delete({
      where: { id },
    });
    return { success: true };
  }

  async findByUser(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where: { postedById: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.job.count({ where: { postedById: userId } }),
    ]);

    return {
      data: jobs,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
