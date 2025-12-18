import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set global prefix for REST APIs
  //app.setGlobalPrefix('weird-chats/v1');
  
  // Enable CORS for WebSocket connections
  app.enableCors({
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"],
    credentials: true
  });
  
  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`WebSocket namespace: /private-chat`);
}
bootstrap();