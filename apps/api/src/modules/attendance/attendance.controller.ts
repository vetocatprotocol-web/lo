import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('record')
  async recordAttendance(
    @Body()
    dto: {
      userId: string;
      deviceId: string;
      latitude: number;
      longitude: number;
      accuracy: number;
      ipAddress: string;
      userAgent: string;
    },
  ) {
    return this.attendanceService.recordAttendance(dto);
  }

  @Get('user/:userId')
  async getUserAttendance(@Param('userId') userId: string, @Query('days') days: string = '7') {
    return this.attendanceService.getUserAttendance(userId, parseInt(days));
  }

  @Get('today')
  async getTodayStats() {
    return this.attendanceService.getTodayStats();
  }
}
