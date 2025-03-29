import mongoose, {Schema, Document} from 'mongoose';

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    _id: string;
}

const userSchema = new Schema<UserDocument>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
