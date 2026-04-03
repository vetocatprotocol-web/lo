import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/common/prisma/prisma.service';
import { generateToken } from '@mas/lib';

@Injectable()
export class QRTokenService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async generateToken() {
    const expirationMs =
      parseInt(process.env.QR_TOKEN_EXPIRATION_SECONDS || '600') * 1000;
    const expiresAt = new Date(Date.now() + expirationMs);

    const token = generateToken(32);
    const jwt = this.jwtService.sign(
      { token, type: 'qr' },
      { expiresIn: expirationMs / 1000 },
    );

    await this.prisma.qRToken.create({
      data: {
        token: jwt,
        isActive: true,
        expiresAt,
      },
    });

    return {
      token: jwt,
      expiresAt,
      refreshInterval: parseInt(process.env.QR_TOKEN_REFRESH_INTERVAL_SECONDS || '10'),
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const dbToken = await this.prisma.qRToken.findUnique({
        where: { token },
      });

      if (!dbToken || !dbToken.isActive || dbToken.expiresAt < new Date()) {
        return { valid: false };
      }

      return { valid: true, payload };
    } catch {
      return { valid: false };
    }
  }
}
