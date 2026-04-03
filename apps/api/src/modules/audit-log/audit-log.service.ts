import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async log(action: string, details: any) {
    return this.prisma.auditLog.create({
      data: {
        action,
        resourceType: details.resourceType,
        resourceId: details.resourceId,
        userId: details.userId,
        changes: details.changes ? JSON.stringify(details.changes) : null,
        ipAddress: details.ipAddress,
        userAgent: details.userAgent,
      },
    });
  }

  async getLogs(action?: string, limit: number = 50) {
    return this.prisma.auditLog.findMany({
      where: action ? { action } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
