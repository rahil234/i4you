import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

console.log(`Connecting to MongoDB at ${MONGODB_URI}`);

@Module({
  imports: [MongooseModule.forRoot(MONGODB_URI), ChatModule],
})
export class AppModule {}
