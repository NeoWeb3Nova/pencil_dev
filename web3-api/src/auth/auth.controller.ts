import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  RegisterDto,
  LoginDto,
  WalletLoginDto,
  WalletChallengeDto,
} from './dto/auth.dto';
import { Web3Service } from '../web3/web3.service';
import { ethers } from 'ethers';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private web3Service: Web3Service,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      registerDto.walletAddress,
    );
    return {
      success: true,
      data: result,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      return {
        success: false,
        data: null,
        error: 'Invalid credentials',
      };
    }

    const result = await this.authService.login(user);
    return {
      success: true,
      data: result,
    };
  }

  /**
   * Get a challenge message for wallet login
   * The client must sign this message with their wallet
   */
  @Post('wallet-challenge')
  async getWalletChallenge(@Body() dto: WalletChallengeDto) {
    // Validate wallet address format
    if (!this.web3Service.isValidAddress(dto.walletAddress)) {
      return {
        success: false,
        error: 'Invalid wallet address format',
      };
    }

    const checksumAddress = this.web3Service.getChecksumAddress(dto.walletAddress);

    // Generate a nonce for this challenge
    const nonce = this.web3Service.generateNonce();

    // Create SIWE-style message
    const message = this.createSiweMessage(checksumAddress, nonce);

    // Store nonce temporarily (in production, use Redis with expiration)
    // For now, we'll include it in the message itself
    return {
      success: true,
      data: {
        message,
        nonce,
        issuedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Wallet-based login using signature verification
   */
  @Post('wallet-login')
  async walletLogin(@Body() walletLoginDto: WalletLoginDto) {
    try {
      // Validate wallet address
      if (!this.web3Service.isValidAddress(walletLoginDto.walletAddress)) {
        return {
          success: false,
          data: null,
          error: 'Invalid wallet address',
        };
      }

      // Validate signature
      const user = await this.authService.validateWalletLogin(
        walletLoginDto.walletAddress,
        walletLoginDto.message,
        walletLoginDto.signature,
      );

      const result = await this.authService.login(user);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Wallet login failed: ${error.message}`);
      return {
        success: false,
        data: null,
        error: error.message || 'Wallet authentication failed',
      };
    }
  }

  /**
   * Link a wallet to existing account
   */
  @Post('link-wallet')
  @UseGuards(JwtAuthGuard)
  async linkWallet(
    @Request() req: any,
    @Body() body: { walletAddress: string; signature: string; message: string },
  ) {
    try {
      const result = await this.authService.linkWallet(
        req.user.userId,
        body.walletAddress,
        body.signature,
        body.message,
      );
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Link wallet failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    const profile = await this.authService.getProfile(req.user.userId);
    return {
      success: true,
      data: profile,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async updateProfile(
    @Request() req: any,
    @Body() body: { name?: string; avatarUrl?: string },
  ) {
    const profile = await this.authService.updateProfile(req.user.userId, body);
    return {
      success: true,
      data: profile,
    };
  }

  /**
   * Create a SIWE (Sign-In with Ethereum) style message
   */
  private createSiweMessage(address: string, nonce: string): string {
    const domain = process.env.APP_DOMAIN || 'localhost';
    const issuedAt = new Date().toISOString();

    return [
      'Welcome to Web3 Job App!',
      '',
      `Sign in with Ethereum to authenticate with your account.`,
      ``,
      `Address: ${address}`,
      `Domain: ${domain}`,
      `Issued At: ${issuedAt}`,
      `Nonce: ${nonce}`,
    ].join('\n');
  }
}
