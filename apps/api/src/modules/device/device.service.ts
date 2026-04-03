import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) {}

  async bindDevice(dto: {
    userId: string;
    deviceId: string;
    deviceModel: string;
    osVersion: string;
  }) {
    const existingDevice = await this.prisma.device.findFirst({
      where: { deviceId: dto.deviceId },
    });

    if (existingDevice && existingDevice.userId !== dto.userId) {
      throw new BadRequestException('Device already bound to another user');
    }

    return this.prisma.device.upsert({
      where: { deviceId: dto.deviceId },
      update: { isActive: true, lastSeen: new Date() },
      create: {
        userId: dto.userId,
        deviceId: dto.deviceId,
        deviceModel: dto.deviceModel,
        osVersion: dto.osVersion,
      },
    });
  }

  async verifyDevice(deviceId: string) {
    const device = await this.prisma.device.findUnique({
      where: { deviceId },
    });

    if (!device || !device.isActive) {
      throw new BadRequestException('Device not found or inactive');
    }

    return { verified: true, userId: device.userId };
  }
}
