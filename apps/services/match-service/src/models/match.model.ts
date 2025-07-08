import mongoose, { Schema, Document } from 'mongoose';

export interface MatchDocument extends Document {
  userA: mongoose.Types.ObjectId;
  userB: mongoose.Types.ObjectId;
  createdAt: Date;
  status: 'matched' | 'blocked';
}

const MatchSchema: Schema = new Schema<MatchDocument>({
  userA: { type: Schema.Types.ObjectId, required: true },
  userB: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['matched', 'blocked'],
    default: 'matched',
  },
});

MatchSchema.index({ userA: 1, userB: 1 }, { unique: true });

export const MatchModel = mongoose.model<MatchDocument>('Match', MatchSchema);
