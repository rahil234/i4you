import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  bio: string;
  photos: string[];
  interests: string[];
  preferences: {
    ageRange: [number, number];
    distance: number;
    gender: 'male' | 'female' | 'all';
    showMe: 'male' | 'female' | 'all';
    lookingFor: 'casual' | 'relationship' | 'friendship' | 'all';
  };
  location: string;
  onboardingCompleted: boolean;
  status: 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    bio: { type: String, required: true },
    photos: { type: [String], required: true },
    interests: { type: [String], required: true },
    preferences: {
      ageRange: { type: [Number], required: true },
      distance: { type: Number, required: true },
      gender: { type: String, required: true },
      showMe: { type: String, required: true },
      lookingFor: { type: String, required: true },
    },
    location: { type: String, required: true },
    onboardingCompleted: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
