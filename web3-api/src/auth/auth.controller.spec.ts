import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Web3Service } from '../web3/web3.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto, LoginDto, WalletLoginDto, WalletChallengeDto } from './dto/auth.dto';
import { ConflictException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let web3Service: Web3Service;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    validateWalletLogin: jest.fn(),
    login: jest.fn(),
    linkWallet: jest.fn(),
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  };

  const mockWeb3Service = {
    isValidAddress: jest.fn(),
    getChecksumAddress: jest.fn(),
    generateNonce: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Web3Service, useValue: mockWeb3Service },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    web3Service = module.get<Web3Service>(Web3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
        walletAddress: undefined,
      };

      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
      const mockResult = {
        access_token: 'jwt-token',
        user: mockUser,
      };
      mockAuthService.register.mockResolvedValue(mockResult);

      const result = await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
        registerDto.walletAddress,
      );
      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
    });

    it('should handle ConflictException for duplicate email', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'Password123',
        name: 'Test User',
      };

      mockAuthService.register.mockRejectedValue(
        new ConflictException('Email already registered')
      );

      const result = await authController.register(registerDto);

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Email already registered',
      });
    });

    it('should handle ConflictException for duplicate wallet address', async () => {
      const registerDto: RegisterDto = {
        email: 'new@example.com',
        password: 'Password123',
        name: 'Test User',
        walletAddress: '0x1234567890123456789012345678901234567890',
      };

      mockAuthService.register.mockRejectedValue(
        new ConflictException('Wallet address already registered')
      );

      const result = await authController.register(registerDto);

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Wallet address already registered',
      });
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'USER' };
      const mockToken = { access_token: 'jwt-token', user: mockUser };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await authController.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        success: true,
        data: mockToken,
      });
    });

    it('should return invalid credentials error', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.validateUser.mockResolvedValue(null);

      const result = await authController.login(loginDto);

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Invalid credentials',
      });
    });
  });

  describe('getWalletChallenge', () => {
    it('should return challenge message for valid wallet address', async () => {
      const challengeDto: WalletChallengeDto = {
        walletAddress: '0x1234567890123456789012345678901234567890',
      };

      const checksumAddress = '0x1234567890123456789012345678901234567890';
      const mockNonce = 'abc123';
      const mockMessage = 'Sign in message';

      mockWeb3Service.isValidAddress.mockReturnValue(true);
      mockWeb3Service.getChecksumAddress.mockReturnValue(checksumAddress);
      mockWeb3Service.generateNonce.mockReturnValue(mockNonce);

      const result = await authController.getWalletChallenge(challengeDto);

      expect(web3Service.isValidAddress).toHaveBeenCalledWith(challengeDto.walletAddress);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('message');
      expect(result.data).toHaveProperty('nonce');
      expect(result.data).toHaveProperty('issuedAt');
    });

    it('should return error for invalid wallet address', async () => {
      const challengeDto: WalletChallengeDto = {
        walletAddress: 'invalid-address',
      };

      mockWeb3Service.isValidAddress.mockReturnValue(false);

      const result = await authController.getWalletChallenge(challengeDto);

      expect(result).toEqual({
        success: false,
        error: 'Invalid wallet address format',
      });
    });
  });

  describe('walletLogin', () => {
    it('should login successfully with valid signature', async () => {
      const walletLoginDto: WalletLoginDto = {
        walletAddress: '0x1234567890123456789012345678901234567890',
        signature: 'valid-signature',
        message: 'sign-in message',
      };

      const mockUser = { id: '1', walletAddress: walletLoginDto.walletAddress, name: 'User 0x1234' };
      const mockToken = { access_token: 'jwt-token', user: mockUser };

      mockWeb3Service.isValidAddress.mockReturnValue(true);
      mockAuthService.validateWalletLogin.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await authController.walletLogin(walletLoginDto);

      expect(authService.validateWalletLogin).toHaveBeenCalledWith(
        walletLoginDto.walletAddress,
        walletLoginDto.message,
        walletLoginDto.signature,
      );
      expect(result).toEqual({
        success: true,
        data: mockToken,
      });
    });

    it('should return error for invalid wallet address', async () => {
      const walletLoginDto: WalletLoginDto = {
        walletAddress: 'invalid-address',
        signature: 'signature',
        message: 'message',
      };

      mockWeb3Service.isValidAddress.mockReturnValue(false);

      const result = await authController.walletLogin(walletLoginDto);

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Invalid wallet address',
      });
    });

    it('should handle wallet authentication error', async () => {
      const walletLoginDto: WalletLoginDto = {
        walletAddress: '0x1234567890123456789012345678901234567890',
        signature: 'invalid-signature',
        message: 'message',
      };

      mockWeb3Service.isValidAddress.mockReturnValue(true);
      mockAuthService.validateWalletLogin.mockRejectedValue(new Error('Invalid signature'));

      const result = await authController.walletLogin(walletLoginDto);

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Invalid signature',
      });
    });
  });

  describe('linkWallet', () => {
    it('should link wallet successfully', async () => {
      const mockReq = { user: { userId: '1' } };
      const body = {
        walletAddress: '0x1234567890123456789012345678901234567890',
        signature: 'valid-signature',
        message: 'link message',
      };

      const mockWalletProfile = { id: '1', userId: '1', walletAddress: body.walletAddress };
      mockAuthService.linkWallet.mockResolvedValue(mockWalletProfile);

      const result = await authController.linkWallet(mockReq as any, body);

      expect(authService.linkWallet).toHaveBeenCalledWith(
        mockReq.user.userId,
        body.walletAddress,
        body.signature,
        body.message,
      );
      expect(result).toEqual({
        success: true,
        data: mockWalletProfile,
      });
    });

    it('should handle link wallet error', async () => {
      const mockReq = { user: { userId: '1' } };
      const body = {
        walletAddress: '0x1234567890123456789012345678901234567890',
        signature: 'invalid-signature',
        message: 'message',
      };

      mockAuthService.linkWallet.mockRejectedValue(new Error('Invalid signature'));

      const result = await authController.linkWallet(mockReq as any, body);

      expect(result).toEqual({
        success: false,
        error: 'Invalid signature',
      });
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockReq = { user: { userId: '1' } };
      const mockProfile = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        applications: [],
        walletProfiles: [],
        postedJobs: [],
      };

      mockAuthService.getProfile.mockResolvedValue(mockProfile);

      const result = await authController.getProfile(mockReq as any);

      expect(authService.getProfile).toHaveBeenCalledWith(mockReq.user.userId);
      expect(result).toEqual({
        success: true,
        data: mockProfile,
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const mockReq = { user: { userId: '1' } };
      const body = { name: 'Updated Name', avatarUrl: 'https://example.com/avatar.png' };
      const mockUpdatedProfile = { id: '1', ...body };

      mockAuthService.updateProfile.mockResolvedValue(mockUpdatedProfile);

      const result = await authController.updateProfile(mockReq as any, body);

      expect(authService.updateProfile).toHaveBeenCalledWith(mockReq.user.userId, body);
      expect(result).toEqual({
        success: true,
        data: mockUpdatedProfile,
      });
    });
  });
});
