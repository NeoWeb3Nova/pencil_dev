import { Module } from '@nestjs/common';
import { WalletProfilesController } from './wallet-profiles.controller';
import { WalletProfilesService } from './wallet-profiles.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [],
  controllers: [WalletProfilesController],
  providers: [WalletProfilesService, PrismaService],
  exports: [WalletProfilesService],
})
export class WalletProfilesModule {}
