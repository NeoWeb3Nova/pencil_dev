import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { WalletType } from '../../wallet-profiles/dto/wallet-profile.dto';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  walletAddress?: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class WalletLoginDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(WalletType)
  @IsOptional()
  walletType?: WalletType;
}

export class WalletChallengeDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}
