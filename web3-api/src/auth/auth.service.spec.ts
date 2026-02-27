import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { Web3Service } from '../web3/web3.service';
import * as bcrypt from 'bcrypt';

// Mock bcrypt at the top level
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Mock data
const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  walletAddress: '0x1234567890123456789012345678901234567890',
  avatarUrl: null,
  passwordHash: 'hashedPassword',
  chainVerification: 'PENDING' as const,
};

const mockSiweUser = {
  id: '2',
  email: null,
  name: 'User 0x1234',
  role: 'USER',
  walletAddress: '0x1234567890123456789012345678901234567890',
  avatarUrl: null,
  passwordHash: null,
  chainVerification: 'PENDING' as const,
};

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let web3Service: Web3Service;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    walletProfile: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockWeb3Service = {
    getChecksumAddress: jest.fn((addr: string) => addr.toLowerCase()),
    verifySignature: jest.fn(),
    getTransactionCount: jest.fn(),
    isValidAddress: jest.fn(),
    generateNonce: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: Web3Service, useValue: mockWeb3Service },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    web3Service = module.get<Web3Service>(Web3Service);
    jwtService = module.get<JwtService>(JwtService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return null if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await authService.validateUser('nonexistent@example.com', 'password');

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });

    it('should return null if user has no password hash', async () => {
      const userWithoutPassword = { ...mockUser, passwordHash: null };
      mockPrismaService.user.findUnique.mockResolvedValue(userWithoutPassword);

      const result = await authService.validateUser('test@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return user without password hash if password is valid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test@example.com', 'correctpassword');

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        walletAddress: '0x1234567890123456789012345678901234567890',
        avatarUrl: null,
        chainVerification: 'PENDING',
      });
      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('validateWalletLogin', () => {
    const walletAddress = '0x1234567890123456789012345678901234567890';
    const message = 'Sign in message';
    const signature = 'valid-signature';

    it('should throw UnauthorizedException if signature is invalid', async () => {
      mockWeb3Service.verifySignature.mockResolvedValue(false);

      await expect(
        authService.validateWalletLogin(walletAddress, message, signature),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should create new user and wallet profile if user does not exist', async () => {
      mockWeb3Service.verifySignature.mockResolvedValue(true);
      mockWeb3Service.getChecksumAddress.mockReturnValue(walletAddress.toLowerCase());
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockSiweUser);
      mockPrismaService.walletProfile.create.mockResolvedValue({ id: '1', userId: '2' });
      mockWeb3Service.getTransactionCount.mockResolvedValue(5);
      mockPrismaService.user.update.mockResolvedValue(mockSiweUser);

      const result = await authService.validateWalletLogin(walletAddress, message, signature);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          walletAddress: walletAddress.toLowerCase(),
          name: 'User 0x1234',
          role: 'USER',
        },
      });
      expect(prismaService.walletProfile.create).toHaveBeenCalled();
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should update chain verification status if transaction count > 10', async () => {
      mockWeb3Service.verifySignature.mockResolvedValue(true);
      mockPrismaService.user.findUnique.mockResolvedValue(mockSiweUser);
      mockWeb3Service.getTransactionCount.mockResolvedValue(15);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockSiweUser,
        chainVerification: 'VERIFIED' as const,
      });

      await authService.validateWalletLogin(walletAddress, message, signature);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockSiweUser.id },
        data: {
          chainVerification: 'VERIFIED',
        },
      });
    });

    it('should return existing user without password hash', async () => {
      mockWeb3Service.verifySignature.mockResolvedValue(true);
      mockPrismaService.user.findUnique.mockResolvedValue(mockSiweUser);
      mockWeb3Service.getTransactionCount.mockResolvedValue(0);

      const result = await authService.validateWalletLogin(walletAddress, message, signature);

      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('login', () => {
    it('should return JWT token and user data', async () => {
      const mockToken = 'jwt-token-123';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await authService.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        walletAddress: mockUser.walletAddress,
        role: mockUser.role,
      });
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          walletAddress: mockUser.walletAddress,
          name: mockUser.name,
          role: mockUser.role,
          avatarUrl: mockUser.avatarUrl,
        },
      });
    });
  });

  describe('register', () => {
    const email = 'newuser@example.com';
    const password = 'securepassword';
    const name = 'New User';
    const walletAddress = '0x1234567890123456789012345678901234567890';

    it('should throw error if email already registered', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({
        id: '1',
        email: 'newuser@example.com',
      });

      await expect(
        authService.register(email, password, name),
      ).rejects.toThrow('Email already registered');
    });

    it('should throw error if wallet address already registered', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({
        id: '1',
        email: 'other@example.com',
        walletAddress: '0x1234567890123456789012345678901234567890',
      });

      await expect(
        authService.register('new@example.com', password, name, walletAddress),
      ).rejects.toThrow('Wallet address already registered');
    });

    it('should create user with hashed password', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      const hashedPassword = 'hashed-' + password;
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockWeb3Service.getChecksumAddress.mockReturnValue(walletAddress.toLowerCase());

      const result = await authService.register(email, password, name, walletAddress);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email,
          passwordHash: hashedPassword,
          name,
          role: 'USER',
          walletAddress: walletAddress.toLowerCase(),
        },
      });
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should create wallet profile if wallet address provided', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockWeb3Service.getChecksumAddress.mockReturnValue(walletAddress.toLowerCase());
      mockPrismaService.walletProfile.create.mockResolvedValue({ id: '1' });

      await authService.register(email, password, name, walletAddress);

      expect(prismaService.walletProfile.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          walletAddress: walletAddress.toLowerCase(),
          walletType: 'METAMASK',
          isPrimary: true,
        },
      });
    });

    it('should not create wallet profile if no wallet address provided', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      await authService.register(email, password, name);

      expect(prismaService.walletProfile.create).not.toHaveBeenCalled();
    });
  });

  describe('linkWallet', () => {
    const userId = '1';
    const walletAddress = '0x1234567890123456789012345678901234567890';
    const signature = 'valid-signature';
    const message = 'link message';

    it('should throw if signature is invalid', async () => {
      mockWeb3Service.verifySignature.mockResolvedValue(false);

      await expect(
        authService.linkWallet(userId, walletAddress, signature, message),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if wallet already linked to another account', async () => {
      mockWeb3Service.verifySignature.mockResolvedValue(true);
      mockPrismaService.walletProfile.findUnique.mockResolvedValue({
        id: '1',
        userId: '999',
        walletAddress: walletAddress.toLowerCase(),
      });

      await expect(
        authService.linkWallet(userId, walletAddress, signature, message),
      ).rejects.toThrow('Wallet already linked to another account');
    });

    it('should link wallet to user successfully', async () => {
      mockWeb3Service.verifySignature.mockResolvedValue(true);
      mockPrismaService.walletProfile.findUnique.mockResolvedValue(null);
      mockWeb3Service.getChecksumAddress.mockReturnValue(walletAddress.toLowerCase());
      mockPrismaService.user.update.mockResolvedValue(mockUser);
      mockPrismaService.walletProfile.create.mockResolvedValue({
        id: '1',
        userId,
        walletAddress: walletAddress.toLowerCase(),
      });

      const result = await authService.linkWallet(userId, walletAddress, signature, message);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { walletAddress: walletAddress.toLowerCase() },
      });
      expect(result).toEqual(expect.objectContaining({ userId, walletAddress: walletAddress.toLowerCase() }));
    });
  });

  describe('getProfile', () => {
    it('should throw error if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.getProfile('nonexistent-id')).rejects.toThrow('User not found');
    });

    it('should return user profile with applications, walletProfiles, and postedJobs', async () => {
      const userWithRelations = {
        ...mockUser,
        applications: [],
        walletProfiles: [],
        postedJobs: [],
      };
      mockPrismaService.user.findUnique.mockResolvedValue(userWithRelations);

      const result = await authService.getProfile(mockUser.id);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        include: {
          applications: {
            include: {
              job: {
                select: {
                  id: true,
                  title: true,
                  company: true,
                },
              },
            },
          },
          walletProfiles: true,
          postedJobs: {
            select: {
              id: true,
              title: true,
              company: true,
              status: true,
            },
          },
        },
      });
      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateData = { name: 'Updated Name', avatarUrl: 'https://example.com/avatar.png' };
      const updatedUser = { ...mockUser, ...updateData };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await authService.updateProfile(mockUser.id, updateData);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: updateData,
      });
      // The service returns the user with passwordHash, but strips it in the return value
      expect(result.name).toBe('Updated Name');
      expect(result.avatarUrl).toBe('https://example.com/avatar.png');
      expect(result).not.toHaveProperty('passwordHash');
    });
  });
});
