import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Database
import { PrismaModule } from './common/prisma/prisma.module';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { DeviceModule } from './modules/device/device.module';
import { LocationModule } from './modules/location/location.module';
import { QRTokenModule } from './modules/qr-token/qr-token.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { DetectionModule } from './modules/detection/detection.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { ConfigServiceModule } from './modules/config/config.module';
import { ImportModule } from './modules/import/import.module';
import { StatsModule } from './modules/stats/stats.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
    AuthModule,
    DeviceModule,
    LocationModule,
    QRTokenModule,
    AttendanceModule,
    DetectionModule,
    AuditLogModule,
    ConfigServiceModule,
    ImportModule,
    StatsModule,
    WebSocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
