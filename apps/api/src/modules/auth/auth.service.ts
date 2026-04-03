import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(nrp: string, pin: string) {
    const user = await this.prisma.user.findUnique({
      where: { nrp },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPinValid = await bcrypt.compare(pin, user.pin);
    if (!isPinValid) {
      throw new UnauthorizedException('Invalid PIN');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      nrp: user.nrp,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        nrp: user.nrp,
        name: user.name,
        rank: user.rank,
        unit: user.unit,
      },
      token,
    };
  }

  async verifyPin(nrp: string, pin: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { nrp },
    });

    if (!user) {
      return false;
    }

    return bcrypt.compare(pin, user.pin);
  }
}
