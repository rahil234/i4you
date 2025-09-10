import { Schema, model, Document } from 'mongoose';

export interface InteractionDocument extends Document {
  fromUserId: string;
  toUserId: string;
  type: 'LIKE' | 'DISLIKE' | 'SUPERLIKE';
  createdAt: Date;
}

const InteractionSchema = new Schema<InteractionDocument>(
  {
    fromUserId: { type: String, required: true, index: true },
    toUserId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['LIKE', 'DISLIKE', 'SUPERLIKE'],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

InteractionSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

export const InteractionModel = model<InteractionDocument>(
  'Interaction',
  InteractionSchema
);
