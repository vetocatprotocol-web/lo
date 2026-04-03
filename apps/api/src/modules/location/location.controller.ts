import { Controller, Post, Body } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('validate')
  async validateLocation(
    @Body() dto: { latitude: number; longitude: number; accuracy: number },
  ) {
    return this.locationService.validateLocation(dto);
  }
}
