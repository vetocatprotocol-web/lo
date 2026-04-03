import { Controller, Get, Put, Body } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('system')
  async getSystemConfig() {
    return this.configService.getSystemConfig();
  }

  @Put('system')
  async updateSystemConfig(@Body() config: any) {
    return this.configService.updateSystemConfig(config);
  }

  @Get('features')
  async getFeatures() {
    return this.configService.getFeatures();
  }
}
