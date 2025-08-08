import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { User } from '@i4you/shared';

export interface UserDocument
  extends Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
    Document<ObjectId> {
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number],
  },
  displayName: {
    type: String,
  },
});

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bio: { type: String },
    interests: { type: [String] },
    preferences: {
      ageRange: { type: [Number] },
      distance: { type: Number },
      gender: {
        type: String,
        enum: ['male', 'female', 'other'],
      },
      showMe: { type: String, enum: ['male', 'female', 'all'] },
      lookingFor: {
        type: String,
        enum: ['casual', 'relationship', 'friendship', 'all'],
      },
    },
    location: locationSchema,
    onboardingCompleted: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ location: '2dsphere' });

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
