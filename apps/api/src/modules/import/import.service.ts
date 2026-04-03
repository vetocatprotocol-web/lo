import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { validateBulkUserData } from '@mas/lib';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ImportService {
  constructor(private prisma: PrismaService) {}

  async importUsers(
    users: Array<{ nrp: string; name: string; rank: string; unit: string; pin: string }>,
    mode: 'overwrite' | 'skip_duplicates',
    userId: string,
  ) {
    const results = {
      successCount: 0,
      failureCount: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const validation = validateBulkUserData(user);

      if (!validation.valid) {
        results.failureCount++;
        results.errors.push(`Row ${i + 1}: ${validation.errors.join(', ')}`);
        continue;
      }

      try {
        const existingUser = await this.prisma.user.findUnique({
          where: { nrp: user.nrp },
        });

        if (existingUser && mode === 'skip_duplicates') {
          results.failureCount++;
          continue;
        }

        const hashedPin = await bcrypt.hash(user.pin, 10);

        if (existingUser) {
          await this.prisma.user.update({
            where: { nrp: user.nrp },
            data: {
              name: user.name,
              rank: user.rank,
              unit: user.unit,
              pin: hashedPin,
            },
          });
        } else {
          await this.prisma.user.create({
            data: {
              nrp: user.nrp,
              name: user.name,
              rank: user.rank,
              unit: user.unit,
              pin: hashedPin,
            },
          });
        }

        results.successCount++;
      } catch (error) {
        results.failureCount++;
        results.errors.push(`Row ${i + 1}: ${(error as Error).message}`);
      }
    }

    // Log the import
    const log = await this.prisma.importLog.create({
      data: {
        userId,
        mode,
        totalRecords: users.length,
        successCount: results.successCount,
        failureCount: results.failureCount,
        errors: JSON.stringify(results.errors),
      },
    });

    return { ...results, importLogId: log.id };
  }

  async getImportLogs() {
    return this.prisma.importLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getImportLog(id: string) {
    const log = await this.prisma.importLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw new BadRequestException('Import log not found');
    }

    return {
      ...log,
      errors: JSON.parse(log.errors),
    };
  }
}
