import { Module } from '@nestjs/common';
import { AttendanceWebSocketGateway } from './websocket.gateway';

@Module({
  providers: [AttendanceWebSocketGateway],
})
export class WebSocketModule {}
