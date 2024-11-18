import { Server } from 'socket.io';
import { createServer } from 'http';
import { Redis } from 'ioredis';

export class SocketService {
  private static instance: SocketService;
  private io!: Server;
  private redis: Redis;

  private constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
    });
    this.setupRedisSubscriber();
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(httpServer: any): void {
    if (this.io) {
      console.warn('Socket.IO server already initialized');
      return;
    }

    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log('🟢 Client connected, ID:', socket.id);
      console.log('📊 Total connected clients:', this.io.engine.clientsCount);
      
      socket.on('disconnect', () => {
        console.log('🔴 Client disconnected, ID:', socket.id);
        console.log('📊 Remaining connected clients:', this.io.engine.clientsCount);
      });

      socket.on('error', (error) => {
        console.error('⚠️ Socket error from client', socket.id, ':', error);
      });
    });
  }

  private setupRedisSubscriber(): void {
    this.redis.subscribe('image-processing-updates', (err) => {
      if (err) {
        console.error('Redis subscription error:', err);
        return;
      }
      console.log('Subscribed to image-processing-updates channel');
    });
    
    this.redis.on('message', (channel, message) => {
      if (channel === 'image-processing-updates') {
        try {
          const update = JSON.parse(message);
          this.emitUpdate(update);
        } catch (error) {
          console.error('Error parsing Redis message:', error);
        }
      }
    });

    this.redis.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }

  public emitUpdate(update: any): void {
    if (!this.io) {
      console.warn('⚠️ Socket.IO server not initialized');
      return;
    }

    try {
      console.log('📤 Emitting update:', update);
      console.log('🔌 Connected clients:', this.io.engine.clientsCount);
      this.io.emit('processing-update', update);
      console.log('✅ Update emitted successfully');
    } catch (error) {
      console.error('❌ Error emitting update:', error);
    }
  }

  public cleanup(): void {
    if (this.io) {
      this.io.close(() => {
        console.log('Socket.IO server closed');
      });
    }

    if (this.redis) {
      this.redis.quit(() => {
        console.log('Redis connection closed');
      });
    }
  }
}
