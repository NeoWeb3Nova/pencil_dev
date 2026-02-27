import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
            },
          },
          sender: {
            select: { id: true, name: true, email: true },
          },
          receiver: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      this.prisma.message.count({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      }),
    ]);

    return {
      data: messages,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
        sender: {
          select: { id: true, name: true, email: true },
        },
        receiver: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user is sender or receiver
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return message;
  }

  async create(senderId: string, createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        jobId: createMessageDto.jobId,
        senderId,
        receiverId: createMessageDto.receiverId,
        content: createMessageDto.content,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
        sender: {
          select: { id: true, name: true, email: true },
        },
        receiver: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async markAsRead(id: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.receiverId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.message.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    return count;
  }
}
