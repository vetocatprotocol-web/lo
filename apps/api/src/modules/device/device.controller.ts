import { Controller, Post, Body, Param } from '@nestjs/common';
import { DeviceService } from './device.service';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('bind')
  async bindDevice(
    @Body() dto: { userId: string; deviceId: string; deviceModel: string; osVersion: string },
  ) {
    return this.deviceService.bindDevice(dto);
  }

  @Post(':deviceId/verify')
  async verifyDevice(@Param('deviceId') deviceId: string) {
    return this.deviceService.verifyDevice(deviceId);
  }
}
