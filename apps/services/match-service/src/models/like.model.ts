import mongoose, { Schema, Document } from 'mongoose';

export interface LikeDocument extends Document<string> {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema<LikeDocument>({
  fromUserId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  toUserId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

LikeSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

export const LikeModel = mongoose.model<LikeDocument>('Like', LikeSchema);
