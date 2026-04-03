import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { QRTokenController } from './qr-token.controller';
import { QRTokenService } from './qr-token.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [QRTokenController],
  providers: [QRTokenService],
  exports: [QRTokenService],
})
export class QRTokenModule {}
