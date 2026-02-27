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
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  async findAll(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.messagesService.findAll(
      req.user.userId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
    return {
      success: true,
      ...result,
    };
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const count = await this.messagesService.getUnreadCount(req.user.userId);
    return {
      success: true,
      data: { count },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const message = await this.messagesService.findOne(id, req.user.userId);
    return {
      success: true,
      data: message,
    };
  }

  @Post()
  async create(@Request() req: any, @Body() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.create(
      req.user.userId,
      createMessageDto,
    );
    return {
      success: true,
      data: message,
    };
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    await this.messagesService.markAsRead(id, req.user.userId);
    return {
      success: true,
      data: null,
    };
  }
}
