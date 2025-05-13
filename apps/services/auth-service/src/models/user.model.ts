import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  status: 'active' | 'suspended';
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
