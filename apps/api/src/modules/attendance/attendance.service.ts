import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async recordAttendance(dto: {
    userId: string;
    deviceId: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    ipAddress: string;
    userAgent: string;
  }) {
    const now = new Date();

    // Determine attendance status (simplified logic)
    const hour = now.getHours();
    let attendanceStatus = 'present';
    if (hour > 9) attendanceStatus = 'late';
    if (hour > 17) attendanceStatus = 'early_leave';

    return this.prisma.activityLog.create({
      data: {
        userId: dto.userId,
        deviceId: dto.deviceId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        accuracy: dto.accuracy,
        attendanceStatus,
        detectionStatus: 'normal',
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
        isVerified: true,
      },
    });
  }

  async getUserAttendance(userId: string, days: number = 7) {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    return this.prisma.activityLog.findMany({
      where: {
        userId,
        timestamp: { gte: sinceDate },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = await this.prisma.activityLog.groupBy({
      by: ['attendanceStatus'],
      where: {
        timestamp: { gte: today, lt: tomorrow },
      },
      _count: true,
    });

    return {
      date: today,
      stats: stats.reduce(
        (acc: Record<string, number>, s: { attendanceStatus: string; _count: number }) => {
          acc[s.attendanceStatus] = s._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
