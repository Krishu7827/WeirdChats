import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayInit, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface PrivateMessageDto {
  text: string;
  receiverId: string;
  senderId: string;
}

@WebSocketGateway({
  cors: { 
   // origin: ["http://localhost:3000", "http://localhost:3001", "*"], // Allow multiple origins
    methods: ["GET", "POST"],
    credentials: true
  },
  namespace: 'private-chat'
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  // Store user ID to socket ID mapping
  private userSocketMap = new Map<string, string>();

  afterInit(server: Server) {
    this.logger.log('Chat Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client ${client.id} connected to private-chat namespace`);
  }

  handleDisconnect(client: Socket) {
    // Remove user from mapping when they disconnect
    let disconnectedUser:any = null;
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        this.userSocketMap.delete(userId);
        disconnectedUser = userId;
        break;
      }
    }
    if (disconnectedUser) {
      this.logger.log(`User ${disconnectedUser} disconnected`);
    }
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('registerUser')
  handleRegisterUser(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    // Register user ID with their socket connection
    this.userSocketMap.set(data.userId, client.id);
    this.logger.log(`User ${data.userId} registered with socket ${client.id}`);
    
    // Confirm registration back to client
    client.emit('registrationSuccess', { 
      userId: data.userId, 
      socketId: client.id 
    });
  }

  @SubscribeMessage('sendPrivateMessage')
  handlePrivateMessage(@MessageBody() messageData: PrivateMessageDto, @ConnectedSocket() client: Socket) {
    const { receiverId, senderId, text } = messageData;

    this.logger.log(`Message from ${senderId} to ${receiverId}: ${text}`);

    // Find the receiver's socket ID
    const receiverSocketId = this.userSocketMap.get(receiverId);

    if (receiverSocketId) {
      // Create message object
      const message = {
        id: Date.now().toString(),
        senderId,
        receiverId,
        text,
        timestamp: new Date(),
        delivered: true
      };

      // Send message ONLY to the specific receiver (one-to-one)
      this.server.to(receiverSocketId).emit('privateMessage', message);

      // Send confirmation back to sender
      client.emit('messageSent', { 
        messageId: message.id, 
        status: 'delivered',
        to: receiverId
      });

      this.logger.log(`Message delivered from ${senderId} to ${receiverId}`);
    } else {
      // Receiver is not online - send failure notice to sender
      client.emit('messageFailed', { 
        message: 'Receiver is offline',
        originalMessage: messageData,
        receiverId: receiverId
      });
      this.logger.log(`Failed to deliver message to ${receiverId} (offline)`);
    }
  }
}