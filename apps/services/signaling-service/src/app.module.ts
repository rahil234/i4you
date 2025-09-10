import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalingModule } from './video/signaling.module.js';

const MONGODB_URI = process.env.MONGODB_URI?.concat(
  '/I4You-videoDB',
  '?retryWrites=true&w=majority&appName=i4you-cluster',
);

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

console.log(`Connecting to MongoDB at ${MONGODB_URI}`);

@Module({
  imports: [MongooseModule.forRoot(MONGODB_URI), SignalingModule],
})
export class AppModule {}
