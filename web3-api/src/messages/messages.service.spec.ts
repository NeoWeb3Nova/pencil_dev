import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PrismaService } from '../database/prisma.service';

describe('MessagesService', () => {
  let messagesService: MessagesService;
  let prismaService: PrismaService;

  const mockMessage = {
    id: '1',
    jobId: 'job1',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'Hello, I am interested in your job posting',
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    message: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    messagesService = module.get<MessagesService>(MessagesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated messages for a user', async () => {
      const messages = [mockMessage];
      const total = 5;

      mockPrismaService.message.findMany.mockResolvedValue(messages);
      mockPrismaService.message.count.mockResolvedValue(total);

      const result = await messagesService.findAll('user1', 1, 10);

      expect(prismaService.message.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ senderId: 'user1' }, { receiverId: 'user1' }],
        },
        skip: 0,
        take: 10,
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
      });
      expect(result).toEqual({
        data: messages,
        metadata: {
          total,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should use default pagination values', async () => {
      mockPrismaService.message.findMany.mockResolvedValue([]);
      mockPrismaService.message.count.mockResolvedValue(0);

      const result = await messagesService.findAll('user1');

      expect(result.data).toEqual([]);
      expect(result.metadata.total).toBe(0);
    });

    it('should return messages where user is sender or receiver', async () => {
      mockPrismaService.message.findMany.mockResolvedValue([]);
      mockPrismaService.message.count.mockResolvedValue(0);

      await messagesService.findAll('user1', 1, 10);

      expect(prismaService.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: expect.arrayContaining([
              { senderId: 'user1' },
              { receiverId: 'user1' },
            ]),
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single message', async () => {
      const mockMessageWithRelations = {
        ...mockMessage,
        sender: { id: 'user1', name: 'User 1', email: 'user1@example.com' },
        receiver: { id: 'user2', name: 'User 2', email: 'user2@example.com' },
        job: { id: 'job1', title: 'Job 1', company: 'Company 1' },
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessageWithRelations);

      const result = await messagesService.findOne('1', 'user1');

      expect(prismaService.message.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
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
      expect(result).toEqual(mockMessageWithRelations);
    });

    it('should throw NotFoundException if message not found', async () => {
      mockPrismaService.message.findUnique.mockResolvedValue(null);

      await expect(messagesService.findOne('nonexistent', 'user1')).rejects.toThrow(
        NotFoundException,
      );
      await expect(messagesService.findOne('nonexistent', 'user1')).rejects.toThrow(
        'Message not found',
      );
    });

    it('should throw NotFoundException if user is not sender or receiver', async () => {
      const mockMessageWithRelations = {
        ...mockMessage,
        senderId: 'user2',
        receiverId: 'user3',
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessageWithRelations);

      await expect(messagesService.findOne('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
      await expect(messagesService.findOne('1', 'user1')).rejects.toThrow(
        'Access denied',
      );
    });
  });

  describe('create', () => {
    const createMessageDto = {
      jobId: 'job1',
      receiverId: 'user2',
      content: 'Hello, I am interested in your job posting',
    };

    it('should create a new message', async () => {
      const mockMessageWithRelations = {
        ...mockMessage,
        ...createMessageDto,
        sender: { id: 'user1', name: 'User 1', email: 'user1@example.com' },
        receiver: { id: 'user2', name: 'User 2', email: 'user2@example.com' },
        job: { id: 'job1', title: 'Job 1', company: 'Company 1' },
      };

      mockPrismaService.message.create.mockResolvedValue(mockMessageWithRelations);

      const result = await messagesService.create('user1', createMessageDto);

      expect(prismaService.message.create).toHaveBeenCalledWith({
        data: {
          jobId: 'job1',
          senderId: 'user1',
          receiverId: 'user2',
          content: 'Hello, I am interested in your job posting',
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
      expect(result).toEqual(mockMessageWithRelations);
    });
  });

  describe('markAsRead', () => {
    it('should mark a message as read', async () => {
      const unreadMessage = { ...mockMessage, isRead: false };
      const readMessage = { ...mockMessage, isRead: true };

      mockPrismaService.message.findUnique.mockResolvedValue(unreadMessage);
      mockPrismaService.message.update.mockResolvedValue(readMessage);

      const result = await messagesService.markAsRead('1', 'user2');

      expect(prismaService.message.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.message.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isRead: true },
      });
      expect(result).toEqual(readMessage);
    });

    it('should throw NotFoundException if message not found', async () => {
      mockPrismaService.message.findUnique.mockResolvedValue(null);

      await expect(messagesService.markAsRead('nonexistent', 'user1')).rejects.toThrow(
        NotFoundException,
      );
      await expect(messagesService.markAsRead('nonexistent', 'user1')).rejects.toThrow(
        'Message not found',
      );
    });

    it('should throw NotFoundException if user is not the receiver', async () => {
      const messageForOtherUser = { ...mockMessage, receiverId: 'user2' };

      mockPrismaService.message.findUnique.mockResolvedValue(messageForOtherUser);

      await expect(messagesService.markAsRead('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
      await expect(messagesService.markAsRead('1', 'user1')).rejects.toThrow(
        'Access denied',
      );
    });
  });

  describe('getUnreadCount', () => {
    it('should return the count of unread messages', async () => {
      const unreadCount = 5;

      mockPrismaService.message.count.mockResolvedValue(unreadCount);

      const result = await messagesService.getUnreadCount('user1');

      expect(prismaService.message.count).toHaveBeenCalledWith({
        where: {
          receiverId: 'user1',
          isRead: false,
        },
      });
      expect(result).toBe(unreadCount);
    });

    it('should return 0 if no unread messages', async () => {
      mockPrismaService.message.count.mockResolvedValue(0);

      const result = await messagesService.getUnreadCount('user1');

      expect(result).toBe(0);
    });
  });
});
