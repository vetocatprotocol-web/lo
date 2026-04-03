import { Controller, Post, Get } from '@nestjs/common';
import { QRTokenService } from './qr-token.service';

@Controller('qr-token')
export class QRTokenController {
  constructor(private readonly qrTokenService: QRTokenService) {}

  @Post('generate')
  async generateToken() {
    return this.qrTokenService.generateToken();
  }

  @Get('refresh')
  async refreshToken() {
    return this.qrTokenService.generateToken();
  }
}
