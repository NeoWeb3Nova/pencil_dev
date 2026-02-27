import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationStatus } from '@prisma/client';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  async create(@Request() req: any, @Body() createApplicationDto: CreateApplicationDto) {
    const application = await this.applicationsService.create(
      req.user.userId,
      createApplicationDto,
    );
    return {
      success: true,
      data: application,
    };
  }

  @Get('my-applications')
  async findAllByUser(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.applicationsService.findAllByUser(
      req.user.userId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
    return {
      success: true,
      ...result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const application = await this.applicationsService.findOne(id, req.user.userId);
    return {
      success: true,
      data: application,
    };
  }

  @Get('job/:jobId')
  async findAllByJob(
    @Param('jobId') jobId: string,
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    // Verify user is the job owner or admin
    const result = await this.applicationsService.findAllByJob(
      jobId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
    return {
      success: true,
      ...result,
    };
  }

  @Post(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ApplicationStatus },
    @Request() req: any,
  ) {
    const application = await this.applicationsService.updateStatus(
      id,
      body.status,
      req.user.userId,
    );
    return {
      success: true,
      data: application,
    };
  }
}
