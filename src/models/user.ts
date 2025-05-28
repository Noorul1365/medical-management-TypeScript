import mongoose, { Schema} from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role: string;
    profilePic?: string;
    isBlocked: boolean;
    isVerified: boolean;
    otp?: string;
    otpExpiry?: Date;
    otpVerified?: boolean;
    accessToken?: string
}


const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['doctor', 'patient'],
        default: 'patient'
    },
    profilePic: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    otpVerified: {
        type: Boolean,
        default: false
    },
    accessToken: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model<IUser>('user', userSchema);