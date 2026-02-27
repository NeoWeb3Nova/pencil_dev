import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JobType, JobStatus } from '@prisma/client';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('type') type?: JobType,
    @Query('status') status?: JobStatus,
  ) {
    const result = await this.jobsService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      search,
      type,
      status,
    );
    return {
      success: true,
      ...result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const job = await this.jobsService.findOne(id);
    return {
      success: true,
      data: job,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() createJobDto: CreateJobDto) {
    const job = await this.jobsService.create(req.user.userId, createJobDto);
    return {
      success: true,
      data: job,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: any,
  ) {
    // Check if user owns the job or is admin
    const job = await this.jobsService.findOne(id);
    if (job.postedById !== req.user.userId && req.user.role !== 'admin') {
      return {
        success: false,
        data: null,
        error: 'Unauthorized to update this job',
      };
    }

    const updatedJob = await this.jobsService.update(id, updateJobDto);
    return {
      success: true,
      data: updatedJob,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    // Check if user owns the job or is admin
    const job = await this.jobsService.findOne(id);
    if (job.postedById !== req.user.userId && req.user.role !== 'admin') {
      return {
        success: false,
        data: null,
        error: 'Unauthorized to delete this job',
      };
    }

    await this.jobsService.delete(id);
    return {
      success: true,
      data: null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/me')
  async findByUser(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.jobsService.findByUser(
      req.user.userId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
    return {
      success: true,
      ...result,
    };
  }
}
