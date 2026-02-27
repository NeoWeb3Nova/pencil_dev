import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum WalletType {
  METAMASK = 'METAMASK',
  WALLET_CONNECT = 'WALLET_CONNECT',
  COINBASE_WALLET = 'COINBASE_WALLET',
  LEDGER = 'LEDGER',
  OTHER = 'OTHER',
}

export class CreateWalletProfileDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsEnum(WalletType)
  @IsOptional()
  walletType?: WalletType;

  @IsOptional()
  isPrimary?: boolean;
}

export class UpdateWalletProfileDto {
  @IsOptional()
  isPrimary?: boolean;

  @IsOptional()
  reputationScore?: number;
}
