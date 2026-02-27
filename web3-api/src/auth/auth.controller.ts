import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

export class RegisterDto {
  email: string;
  password: string;
  name: string;
}

export class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
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
  async updateProfile(@Request() req: any, @Body() body: { name?: string }) {
    const profile = await this.authService.updateProfile(req.user.userId, body);
    return {
      success: true,
      data: profile,
    };
  }
}
