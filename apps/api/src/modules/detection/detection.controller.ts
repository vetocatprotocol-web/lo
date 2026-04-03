import { Controller, Post, Body } from '@nestjs/common';
import { DetectionService } from './detection.service';

@Controller('detection')
export class DetectionController {
  constructor(private readonly detectionService: DetectionService) {}

  @Post('analyze')
  async analyzeActivity(
    @Body()
    dto: {
      userId: string;
      latitude: number;
      longitude: number;
      accuracy: number;
      deviceId: string;
    },
  ) {
    return this.detectionService.analyzeActivity(dto);
  }
}
