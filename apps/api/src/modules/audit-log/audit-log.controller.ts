import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async getLogs(
    @Query('action') action?: string,
    @Query('limit') limit: string = '50',
  ) {
    return this.auditLogService.getLogs(action, parseInt(limit));
  }
}
