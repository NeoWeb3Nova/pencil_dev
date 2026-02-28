import { Injectable, Logger, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { Web3Service } from '../web3/web3.service';
import * as bcrypt from 'bcrypt';
import { ethers } from 'ethers';

export interface JwtPayload {
  sub: string;
  email?: string;
  walletAddress?: string;
  role: string;
}

export interface AuthResult {
  access_token: string;
  user: {
    id: string;
    email?: string | null;
    walletAddress?: string | null;
    name: string;
    role: string;
    avatarUrl?: string | null;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private web3Service: Web3Service,
  ) {}

  /**
   * Validate traditional email/password login
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    if (!user.passwordHash) {
      this.logger.warn(`User ${email} has no password hash (may be wallet-only user)`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    // Remove password from returned user
    const { passwordHash, ...result } = user;
    return result;
  }

  /**
   * Validate wallet signature login
   */
  async validateWalletLogin(
    walletAddress: string,
    message: string,
    signature: string,
  ): Promise<any> {
    try {
      // Normalize wallet address
      const checksumAddress = this.web3Service.getChecksumAddress(walletAddress);

      // Verify signature
      const isValidSignature = await this.web3Service.verifySignature(
        message,
        signature,
        walletAddress,
      );

      if (!isValidSignature) {
        throw new UnauthorizedException('Invalid signature');
      }

      // Find user by wallet address
      let user = await this.prisma.user.findUnique({
        where: { walletAddress: checksumAddress },
      });

      // If user doesn't exist, create a new one (auto-registration)
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            walletAddress: checksumAddress,
            name: `User ${checksumAddress.slice(0, 6)}`,
            role: 'USER',
          },
        });

        // Also create wallet profile
        await this.prisma.walletProfile.create({
          data: {
            userId: user.id,
            walletAddress: checksumAddress,
            walletType: 'METAMASK',
            isPrimary: true,
          },
        });

        this.logger.log(`Created new user for wallet ${checksumAddress}`);
      }

      // Update chain verification status if applicable
      const transactionCount = await this.web3Service.getTransactionCount(checksumAddress);
      if (transactionCount > 0) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            chainVerification: transactionCount > 10 ? 'VERIFIED' : 'PENDING',
          },
        });
      }

      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      this.logger.error(`Wallet login validation failed: ${error}`);
      throw new UnauthorizedException('Wallet authentication failed');
    }
  }

  /**
   * Generate JWT token for authenticated user
   */
  async login(user: any): Promise<AuthResult> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      walletAddress: user.walletAddress,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  /**
   * Register a new user with email/password
   */
  async register(
    email: string,
    password: string,
    name: string,
    walletAddress?: string,
  ) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          walletAddress ? { walletAddress } : undefined,
        ].filter(Boolean) as any[],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already registered');
      }
      if (existingUser.walletAddress === walletAddress) {
        throw new ConflictException('Wallet address already registered');
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'USER',
        walletAddress: walletAddress ? this.web3Service.getChecksumAddress(walletAddress) : null,
      },
    });

    // Create wallet profile if wallet address provided
    if (walletAddress) {
      await this.prisma.walletProfile.create({
        data: {
          userId: user.id,
          walletAddress: this.web3Service.getChecksumAddress(walletAddress),
          walletType: 'METAMASK',
          isPrimary: true,
        },
      });
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      walletAddress: user.walletAddress,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    // Remove password from returned user
    const { passwordHash: _, ...result } = user;
    return {
      access_token,
      user: result,
    };
  }

  /**
   * Link a wallet to an existing user account
   */
  async linkWallet(userId: string, walletAddress: string, signature: string, message: string) {
    const checksumAddress = this.web3Service.getChecksumAddress(walletAddress);

    // Verify signature
    const isValidSignature = await this.web3Service.verifySignature(
      message,
      signature,
      walletAddress,
    );

    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Check if wallet is already linked to another user
    const existingWallet = await this.prisma.walletProfile.findUnique({
      where: { walletAddress: checksumAddress },
    });

    if (existingWallet && existingWallet.userId !== userId) {
      throw new Error('Wallet already linked to another account');
    }

    // Update user with wallet address
    await this.prisma.user.update({
      where: { id: userId },
      data: { walletAddress: checksumAddress },
    });

    // Create wallet profile
    const walletProfile = await this.prisma.walletProfile.create({
      data: {
        userId,
        walletAddress: checksumAddress,
        walletType: 'METAMASK',
        isPrimary: true,
      },
    });

    return walletProfile;
  }

  /**
   * Get user profile with related data
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new Error('User not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: { name?: string; avatarUrl?: string; nftAvatarTokenId?: string },
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    const { passwordHash, ...result } = user;
    return result;
  }
}
