import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WalletProfilesService } from './wallet-profiles.service';
import { CreateWalletProfileDto, UpdateWalletProfileDto } from './dto/wallet-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallet-profiles')
@UseGuards(JwtAuthGuard)
export class WalletProfilesController {
  constructor(private walletProfilesService: WalletProfilesService) {}

  @Post()
  async create(
    @Request() req: any,
    @Body() createWalletProfileDto: CreateWalletProfileDto,
  ) {
    const result = await this.walletProfilesService.create(
      req.user.userId,
      createWalletProfileDto,
    );
    return {
      success: true,
      data: result,
    };
  }

  @Get()
  async findAllByUser(@Request() req: any) {
    const result = await this.walletProfilesService.findAllByUser(req.user.userId);
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const result = await this.walletProfilesService.findOne(id, req.user.userId);
    return {
      success: true,
      data: result,
    };
  }

  @Put(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateWalletProfileDto: UpdateWalletProfileDto,
  ) {
    const result = await this.walletProfilesService.update(
      id,
      req.user.userId,
      updateWalletProfileDto,
    );
    return {
      success: true,
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.walletProfilesService.remove(id, req.user.userId);
    return {
      success: true,
      message: 'Wallet profile deleted successfully',
    };
  }
}
