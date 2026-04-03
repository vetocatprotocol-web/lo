import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ConfigService } from '../config/config.service';
import { analyzeActivityForAnomalies } from '@mas/lib';
import type { DetectionContext, IActivityLog } from '@mas/types';

@Injectable()
export class DetectionService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async analyzeActivity(dto: {
    userId: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    deviceId: string;
  }) {
    // Get previous activity
    const previousActivity = await this.prisma.activityLog.findFirst({
      where: { userId: dto.userId },
      orderBy: { timestamp: 'desc' },
      take: 1,
    });

    // Get recent activities for context
    const recentActivities = await this.prisma.activityLog.findMany({
      where: { userId: dto.userId },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    // Get detection level from config
    const config = await this.configService.getSystemConfig();
    const detectionLevel = config.detection.level;

    // Create detection context
    const context: DetectionContext = {
      userId: dto.userId,
      latitude: dto.latitude,
      longitude: dto.longitude,
      accuracy: dto.accuracy,
      timestamp: new Date(),
      previousActivity:
        (previousActivity as unknown as IActivityLog) ?? undefined,
    };

    // Analyze
    const result = analyzeActivityForAnomalies(
      context,
      detectionLevel,
      recentActivities as unknown as IActivityLog[],
    );

    return result;
  }
}
