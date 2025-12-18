import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway],  // Only gateway, no service yet
  exports: [ChatGateway]
})
export class ChatModule {}