import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Web3Module } from '../web3/web3.module';
import { DatabaseModule } from '../database/database.module';

const jwtOptions: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'default-secret',
  signOptions: {
    expiresIn: (process.env.JWT_EXPIRATION || '7d') as any,
  },
};

@Module({
  imports: [
    PassportModule,
    JwtModule.register(jwtOptions),
    DatabaseModule,
    Web3Module,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
