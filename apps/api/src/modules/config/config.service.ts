import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import type { ISystemConfigValue } from '@mas/types';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async getSystemConfig(): Promise<ISystemConfigValue> {
    const config = await this.prisma.systemConfig.findUnique({
      where: { key: 'system_config' },
    });

    if (!config) {
      return {
        auth: { pin: true, otp: false, face: true },
        device: { mode: 'strict' },
        geo: { mode: 'hybrid', radius: 50 },
        qr: { refresh: 10 },
        detection: { level: 'high' },
      };
    }

    return JSON.parse(config.value);
  }

  async updateSystemConfig(config: ISystemConfigValue) {
    return this.prisma.systemConfig.upsert({
      where: { key: 'system_config' },
      update: { value: JSON.stringify(config) },
      create: {
        key: 'system_config',
        value: JSON.stringify(config),
      },
    });
  }

  async getFeatures() {
    const config = await this.getSystemConfig();
    return {
      auth: config.auth,
      detection: config.detection,
      device: config.device,
    };
  }

  async isFeatureEnabled(feature: string): Promise<boolean> {
    const config = await this.getSystemConfig();
    const keys = feature.split('.');
    let value: any = config;

    for (const key of keys) {
      value = value?.[key];
    }

    return !!value;
  }
}
