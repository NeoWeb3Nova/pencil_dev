import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('resumes')
export class ResumesController {
  constructor(private resumesService: ResumesService) {}

  /**
   * Get my own resume
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMyResume(@Request() req: any) {
    const resume = await this.resumesService.findMyResume(req.user.userId);
    return {
      success: true,
      data: resume,
    };
  }

  /**
   * Create a new resume
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() createResumeDto: CreateResumeDto) {
    const resume = await this.resumesService.create(req.user.userId, createResumeDto);
    return {
      success: true,
      data: resume,
    };
  }

  /**
   * Update existing resume
   */
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req: any, @Body() updateResumeDto: UpdateResumeDto) {
    const resume = await this.resumesService.update(req.user.userId, updateResumeDto);
    return {
      success: true,
      data: resume,
    };
  }

  /**
   * Delete resume
   */
  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Request() req: any) {
    await this.resumesService.delete(req.user.userId);
    return {
      success: true,
      data: null,
    };
  }

  /**
   * Get public resume by user ID (no auth required)
   */
  @Get('public/:userId')
  async getPublicResume(@Param('userId') userId: string) {
    const resume = await this.resumesService.findPublicResume(userId);

    if (!resume) {
      return {
        success: false,
        data: null,
        error: 'Resume not found or not public',
      };
    }

    return {
      success: true,
      data: resume,
    };
  }

  /**
   * Get my resume with user info
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyResumeWithInfo(@Request() req: any) {
    const resume = await this.resumesService.findMyResume(req.user.userId);
    return {
      success: true,
      data: resume,
      user: {
        id: req.user.userId,
        email: req.user.email,
        name: req.user.name,
      },
    };
  }

  /**
   * Get all resumes (admin only)
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Request() req?: any,
  ) {
    // Check admin role
    if (req.user.role !== 'ADMIN') {
      return {
        success: false,
        data: null,
        error: 'Admin access required',
      };
    }

    const result = await this.resumesService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
    return {
      success: true,
      ...result,
    };
  }
}
