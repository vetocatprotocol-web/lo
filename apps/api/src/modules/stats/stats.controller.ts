import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('attendance')
  async getAttendanceStats() {
    return this.statsService.getAttendanceStats();
  }

  @Get('dashboard')
  async getDashboardStats() {
    return this.statsService.getDashboardStats();
  }
}
