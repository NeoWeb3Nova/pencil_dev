import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateWalletProfileDto, UpdateWalletProfileDto } from './dto/wallet-profile.dto';

@Injectable()
export class WalletProfilesService {
  private readonly logger = new Logger(WalletProfilesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new wallet profile for a user
   */
  async create(userId: string, dto: CreateWalletProfileDto) {
    // Check if wallet already exists
    const existing = await this.prisma.walletProfile.findUnique({
      where: { walletAddress: dto.walletAddress },
    });

    if (existing) {
      throw new Error('Wallet address already registered');
    }

    // If this is marked as primary, unset other primary wallets
    let isPrimary = dto.isPrimary ?? false;
    if (isPrimary) {
      await this.prisma.walletProfile.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return this.prisma.walletProfile.create({
      data: {
        userId,
        walletAddress: dto.walletAddress,
        walletType: dto.walletType || 'METAMASK',
        isPrimary,
      },
    });
  }

  /**
   * Get all wallet profiles for a user
   */
  async findAllByUser(userId: string) {
    return this.prisma.walletProfile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a specific wallet profile by ID
   */
  async findOne(id: string, userId: string) {
    const wallet = await this.prisma.walletProfile.findFirst({
      where: { id, userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet profile not found');
    }

    return wallet;
  }

  /**
   * Update a wallet profile
   */
  async update(id: string, userId: string, dto: UpdateWalletProfileDto) {
    // If setting as primary, unset others
    if (dto.isPrimary) {
      await this.prisma.walletProfile.updateMany({
        where: { userId, isPrimary: true, NOT: { id } },
        data: { isPrimary: false },
      });
    }

    return this.prisma.walletProfile.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Update wallet reputation score based on on-chain activity
   */
  async updateReputation(
    walletAddress: string,
    transactionCount: number,
  ) {
    // Simple reputation scoring algorithm
    // - Base score: 0
    // - +1 point per 10 transactions (max 50 points)
    // - Bonus for verified contracts interactions (future)
    const reputationScore = Math.min(50, Math.floor(transactionCount / 10));

    return this.prisma.walletProfile.updateMany({
      where: { walletAddress },
      data: {
        reputationScore,
        transactionCount,
      },
    });
  }

  /**
   * Delete a wallet profile
   */
  async remove(id: string, userId: string) {
    const wallet = await this.prisma.walletProfile.findFirst({
      where: { id, userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet profile not found');
    }

    return this.prisma.walletProfile.delete({
      where: { id },
    });
  }

  /**
   * Get primary wallet for a user
   */
  async getPrimaryWallet(userId: string) {
    return this.prisma.walletProfile.findFirst({
      where: { userId, isPrimary: true },
    });
  }
}
