import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  photos: string[];
  interests: string[];
  preferences: {
    ageRange: [number, number];
    distance: number;
    showMe: 'male' | 'female' | 'all';
    lookingFor: 'casual' | 'relationship' | 'friendship' | 'all';
  };
  location: {
    type: 'Point';
    coordinates: [number, number];
    displayName: string;
  };
  onboardingCompleted: boolean;
  status: 'active' | 'suspended';
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
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    bio: { type: String, required: true },
    photos: { type: [String], required: true },
    interests: { type: [String], required: true },
    preferences: {
      ageRange: { type: [Number], required: true },
      distance: { type: Number, required: true },
      gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
      },
      showMe: { type: String, required: true, enum: ['male', 'female', 'all'] },
      lookingFor: {
        type: String,
        required: true,
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
