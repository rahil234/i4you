import mongoose, { Schema, Document } from 'mongoose';

export interface AdminDocument extends Document {
  _id: string;
  name: string;
  email: string;
  status: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<AdminDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const AdminModel = mongoose.model<AdminDocument>('Admin', adminSchema);
