import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  boardId?: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/retro',
})
export class RetroWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RetroWebSocketGateway.name);
  private connectedUsers = new Map<string, Set<string>>(); // boardId -> Set of userIds

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extrair token do handshake
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      this.logger.log(`Connection attempt from ${client.id}`);
      
      if (!token) {
        this.logger.warn(`No token provided for client ${client.id}`);
        client.disconnect();
        return;
      }

      // Verificar token JWT
      const payload = await this.jwtService.verifyAsync(token);
      client.userId = payload.sub;

      this.logger.log(`User ${client.userId} connected successfully`);
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId && client.boardId) {
      this.leaveBoard(client.boardId, client.userId);
      this.emitActiveUsers(client.boardId);
    }
    this.logger.log(`User ${client.userId} disconnected`);
  }

  @SubscribeMessage('join-board')
  async handleJoinBoard(
    @MessageBody() data: { boardId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { boardId } = data;
    const userId = client.userId;

    if (!userId) return;

    // Leave previous board if any
    if (client.boardId) {
      this.leaveBoard(client.boardId, userId);
    }

    // Join new board
    client.boardId = boardId;
    await client.join(`board:${boardId}`);
    
    this.joinBoard(boardId, userId);
    this.emitActiveUsers(boardId);

    this.logger.log(`User ${userId} joined board ${boardId}`);
  }

  @SubscribeMessage('leave-board')
  async handleLeaveBoard(
    @MessageBody() data: { boardId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { boardId } = data;
    const userId = client.userId;

    if (!userId) return;

    await client.leave(`board:${boardId}`);
    this.leaveBoard(boardId, userId);
    this.emitActiveUsers(boardId);
    client.boardId = undefined;

    this.logger.log(`User ${userId} left board ${boardId}`);
  }

  // Métodos para emitir eventos do backend
  emitCardCreated(boardId: string, card: any) {
    this.server.to(`board:${boardId}`).emit('card-created', { card });
  }

  emitCardUpdated(boardId: string, card: any) {
    this.server.to(`board:${boardId}`).emit('card-updated', { card });
  }

  emitCardDeleted(boardId: string, cardId: string) {
    this.server.to(`board:${boardId}`).emit('card-deleted', { cardId });
  }

  emitCardVoted(boardId: string, cardId: string, voteCount: number) {
    this.server.to(`board:${boardId}`).emit('card-voted', { cardId, voteCount });
  }

  emitColumnCreated(boardId: string, column: any) {
    this.server.to(`board:${boardId}`).emit('column-created', { column });
  }

  emitColumnUpdated(boardId: string, column: any) {
    this.server.to(`board:${boardId}`).emit('column-updated', { column });
  }

  emitColumnDeleted(boardId: string, columnId: string) {
    this.server.to(`board:${boardId}`).emit('column-deleted', { columnId });
  }

  emitColumnsReordered(boardId: string, columns: any[]) {
    this.server.to(`board:${boardId}`).emit('columns-reordered', { columns });
  }

  emitBoardUpdated(boardId: string, board: any) {
    this.server.to(`board:${boardId}`).emit('board-updated', { board });
  }

  private joinBoard(boardId: string, userId: string) {
    if (!this.connectedUsers.has(boardId)) {
      this.connectedUsers.set(boardId, new Set());
    }
    this.connectedUsers.get(boardId)!.add(userId);
  }

  private leaveBoard(boardId: string, userId: string) {
    const boardUsers = this.connectedUsers.get(boardId);
    if (boardUsers) {
      boardUsers.delete(userId);
      if (boardUsers.size === 0) {
        this.connectedUsers.delete(boardId);
      }
    }
  }

  private emitActiveUsers(boardId: string) {
    const userIds = Array.from(this.connectedUsers.get(boardId) || []);
    this.server.to(`board:${boardId}`).emit('active-users-updated', { userIds });
  }
}
