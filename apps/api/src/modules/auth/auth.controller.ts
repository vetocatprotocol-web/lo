import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { nrp: string; pin: string }) {
    try {
      const result = await this.authService.login(loginDto.nrp, loginDto.pin);
      return {
        success: true,
        data: result,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          timestamp: new Date(),
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('verify-pin')
  async verifyPin(@Body() dto: { nrp: string; pin: string }) {
    try {
      const result = await this.authService.verifyPin(dto.nrp, dto.pin);
      return {
        success: result,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          timestamp: new Date(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
