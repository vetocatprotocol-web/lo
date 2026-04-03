import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import type { IAttendanceStats } from '@mas/types';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getAttendanceStats(): Promise<IAttendanceStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalMembers = await this.prisma.user.count({ where: { isActive: true } });

    const stats = await this.prisma.activityLog.groupBy({
      by: ['attendanceStatus'],
      where: {
        timestamp: { gte: today, lt: tomorrow },
      },
      _count: true,
    });

    const detectionStats = await this.prisma.activityLog.groupBy({
      by: ['detectionStatus'],
      where: {
        timestamp: { gte: today, lt: tomorrow },
      },
      _count: true,
    });

    const statMap = stats.reduce(
      (acc: Record<string, number>, s: { attendanceStatus: string; _count: number }) => {
        acc[s.attendanceStatus] = s._count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const detectionMap = detectionStats.reduce(
      (acc: Record<string, number>, s: { detectionStatus: string; _count: number }) => {
        acc[s.detectionStatus] = s._count;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalMembers,
      presentCount: statMap['present'] || 0,
      absentCount: statMap['absent'] || 0,
      lateCount: statMap['late'] || 0,
      suspiciousCount: detectionMap['suspicious'] || 0,
      blockedCount: detectionMap['blocked'] || 0,
      lastUpdated: new Date(),
    };
  }

  async getDashboardStats() {
    const stats = await this.getAttendanceStats();
    const recentActivities = await this.prisma.activityLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    const activeMembers = await this.prisma.device.count({
      where: { isActive: true },
    });

    return {
      stats,
      recentActivities,
      activeMembers,
      inactiveMembers: stats.totalMembers - activeMembers,
    };
  }
}
