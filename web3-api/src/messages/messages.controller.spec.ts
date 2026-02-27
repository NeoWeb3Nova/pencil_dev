import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('MessagesController', () => {
  let messagesController: MessagesController;
  let messagesService: MessagesService;

  const mockMessagesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    markAsRead: jest.fn(),
    getUnreadCount: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  const mockMessage = {
    id: '1',
    jobId: 'job1',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'Hello, I am interested in your job posting',
    isRead: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        { provide: MessagesService, useValue: mockMessagesService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    messagesController = module.get<MessagesController>(MessagesController);
    messagesService = module.get<MessagesService>(MessagesService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated messages', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const mockResult = {
        data: [mockMessage],
        metadata: { total: 5, page: 1, limit: 10, totalPages: 1 },
      };

      mockMessagesService.findAll.mockResolvedValue(mockResult);

      const result = await messagesController.findAll(mockReq as any, 1, 10);

      expect(messagesService.findAll).toHaveBeenCalledWith('user1', 1, 10);
      expect(result).toEqual({
        success: true,
        ...mockResult,
      });
    });

    it('should use default pagination values', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const mockResult = {
        data: [],
        metadata: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };

      mockMessagesService.findAll.mockResolvedValue(mockResult);

      await messagesController.findAll(mockReq as any);

      expect(messagesService.findAll).toHaveBeenCalledWith('user1', 1, 10);
    });
  });

  describe('getUnreadCount', () => {
    it('should return the count of unread messages', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const mockCount = 5;

      mockMessagesService.getUnreadCount.mockResolvedValue(mockCount);

      const result = await messagesController.getUnreadCount(mockReq as any);

      expect(messagesService.getUnreadCount).toHaveBeenCalledWith('user1');
      expect(result).toEqual({
        success: true,
        data: { count: mockCount },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single message', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const mockResult = {
        ...mockMessage,
        sender: { id: 'user1', name: 'User 1' },
        receiver: { id: 'user2', name: 'User 2' },
      };

      mockMessagesService.findOne.mockResolvedValue(mockResult);

      const result = await messagesController.findOne('1', mockReq as any);

      expect(messagesService.findOne).toHaveBeenCalledWith('1', 'user1');
      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
    });
  });

  describe('create', () => {
    const createMessageDto = {
      jobId: 'job1',
      receiverId: 'user2',
      content: 'Hello, I am interested in your job posting',
    };

    it('should create a new message', async () => {
      const mockReq = { user: { userId: 'user1' } };
      const mockResult = {
        ...mockMessage,
        ...createMessageDto,
      };

      mockMessagesService.create.mockResolvedValue(mockResult);

      const result = await messagesController.create(mockReq as any, createMessageDto);

      expect(messagesService.create).toHaveBeenCalledWith('user1', createMessageDto);
      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark a message as read', async () => {
      const mockReq = { user: { userId: 'user1' } };

      mockMessagesService.markAsRead.mockResolvedValue(undefined);

      const result = await messagesController.markAsRead('1', mockReq as any);

      expect(messagesService.markAsRead).toHaveBeenCalledWith('1', 'user1');
      expect(result).toEqual({
        success: true,
        data: null,
      });
    });
  });
});
