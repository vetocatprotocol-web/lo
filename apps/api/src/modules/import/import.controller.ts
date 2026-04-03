import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('users')
  async importUsers(
    @Body()
    dto: {
      users: Array<{ nrp: string; name: string; rank: string; unit: string; pin: string }>;
      mode: 'overwrite' | 'skip_duplicates';
      userId: string;
    },
  ) {
    return this.importService.importUsers(dto.users, dto.mode, dto.userId);
  }

  @Get('logs')
  async getImportLogs() {
    return this.importService.getImportLogs();
  }

  @Get('logs/:id')
  async getImportLog(@Param('id') id: string) {
    return this.importService.getImportLog(id);
  }
}
