import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    accessToken?: string;
    profilePic?: string;
    otp?: string;
    otpExpiry?: Date;
    isVerified: boolean;
}

const adminSchema: Schema<IAdmin> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        accessToken: {
            type: String,
        },
        role: {
            type: String,
            default: 'admin',
        },
        profilePic: {
            type: String,
        },
        otp: {
            type: String,
        },
        otpExpiry: { 
            type: Date 
        },
        isVerified: {
            type: Boolean
        }
    },
    { timestamps: true }
)

const Admin = mongoose.model<IAdmin>('admin', adminSchema);
export default Admin;