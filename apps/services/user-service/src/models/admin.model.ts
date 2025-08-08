import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface AdminDocument extends Document<ObjectId> {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  status: 'active' | 'suspended';
  updatedAt: Date;
}

const adminSchema = new Schema<AdminDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const AdminModel = mongoose.model<AdminDocument>('Admin', adminSchema);
