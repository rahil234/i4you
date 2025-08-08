import { Schema, model, Document, ObjectId } from 'mongoose';

export interface ModerationDocument extends Document<ObjectId> {
  userId: string;
  publicId: string;
}

const moderationSchema = new Schema<ModerationDocument>({
  userId: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
});

export const ModerationModel = model<ModerationDocument>('Moderation', moderationSchema);
