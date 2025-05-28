import adminModel from '../../models/admin';
import { Request, Response } from "express";
import asyncHandler from '../../utils/errorHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../../utils/sendOtp'

declare global {
    namespace Express {
      interface Request {
        adminID?: string;
        adminRole?: string;
      }
    }
}

export const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, profilePic } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ code: 400, success: false, message: "required field missing"});
    }

    const existingAdmin = await adminModel.findOne({ email });

    if(existingAdmin) {
        return res.status(400).json({ code: 400, success: false, message: "admin already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new adminModel({
        name,
        email,
        password: hashedPassword,
        profilePic
    })

    await admin.save();

    return res.status(200).json({ code: 200, success: true, message: "admin created successfully", data: admin });
})

export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ code: 400, success: false, message: "email and password is required"})
    }

    const existAdmin = await adminModel.findOne({ email });

    if(!existAdmin){
        return res.status(400).json({ code: 400, success: false, message: "admin not found" });
    }

    const isMatch = await bcrypt.compare(password, existAdmin.password)

    if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials.",
        });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ admin_id: existAdmin._id, admin_role: existAdmin.role }, jwtSecret, { expiresIn: '90d' });

    existAdmin.accessToken = token;
    await existAdmin.save();

    return res.status(200).json({ code: 200, success: true, message: "login successfully", data: existAdmin });
})

export const changeAdminPassword = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ code: 400, success: false, message: 'Both current and new passwords are required.' });
    }

    const adminId = req.adminID;

    const admin = await adminModel.findById(adminId).select('+password');
    if (!admin) {
        return res.status(404).json({ code: 404, success: false, message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
        return res.status(401).json({ code: 401, success: false, message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ code: 200, success: true, message: 'Password changed successfully', data: admin });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Email is required.'
        });
    }

    const admin = await adminModel.findOne({ email });

    if (!admin) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Admin not found.'
        });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const otpExpiry  = new Date(Date.now() + 10 * 60 * 1000); // 1 minute from now

    await sendOtpEmail(email, otp);

    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    res.status(200).json({
        code: 200,
        success: true,
        message: 'OTP sent to your registered email.',
        otp: otp
    });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const admin = await adminModel.findOne({ email });

    if(!admin) {
        return res.status(400).json({ code: 400, success: false, message: 'Admin not found.' });
    }

    if ( admin.otpExpiry && (admin.otp !== otp || new Date() > admin.otpExpiry)) {
        return res.status(400).json({ code: 400, success: false, message: 'Invalid OTP.' });
    }

    admin.isVerified = true;
    admin.otp = undefined;
    admin.otpExpiry = undefined;

    await admin.save();

    res.status(200).json({ code: 200, success: true, message: 'OTP verify successfully' })
})

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, newPassword, confirmPassword } = req.body;

    const admin = await adminModel.findOne({ email });

    if(!admin) {
        return res.status(400).json({ code: 400, success: false, message: "admin not found" });
    }

    if (newPassword!== confirmPassword) {
        return res.status(400).json({ code: 400, success: false, message: 'Passwords do not match.' });
    }

    if(!admin.isVerified){
        return res.status(400).json({ code: 400, success: false, message: 'Please verify otp then reset password'})
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.isVerified = false;
    await admin.save();
    res.status(200).json({ code: 200, success: true, message: 'Password reset successfully' });
})
