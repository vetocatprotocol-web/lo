import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  WS_EVENT_STATS_UPDATE,
  WS_EVENT_ACTIVITY_LOG,
  WS_EVENT_ALERT,
  WS_EVENT_QR_REFRESH,
} from '@mas/constants';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws',
})
export class AttendanceWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;

  afterInit(server: Server) {
    console.log('✅ WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`📱 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`📱 Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('stats:subscribe')
  handleStatsSubscribe(client: Socket) {
    client.join('stats');
    return { event: 'subscribed', data: 'stats' };
  }

  // Public method to broadcast stats update
  broadcastStatsUpdate(data: any) {
    this.server.to('stats').emit(WS_EVENT_STATS_UPDATE, {
      data,
      timestamp: new Date(),
    });
  }

  // Public method to broadcast activity log
  broadcastActivityLog(data: any) {
    this.server.to('stats').emit(WS_EVENT_ACTIVITY_LOG, {
      data,
      timestamp: new Date(),
    });
  }

  // Public method to broadcast alert
  broadcastAlert(data: any) {
    this.server.to('stats').emit(WS_EVENT_ALERT, {
      data,
      timestamp: new Date(),
    });
  }

  // Public method to send QR refresh signal
  sendQRRefresh(userId: string) {
    this.server.to(`user:${userId}`).emit(WS_EVENT_QR_REFRESH, {
      timestamp: new Date(),
    });
  }
}
