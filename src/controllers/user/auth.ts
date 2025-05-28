import userModel from '../../models/user';
import { Request, Response } from "express";
import asyncHandler from '../../utils/errorHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../../utils/sendOtp'

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, profilePic, role } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ code: 400, success: false, message: "required field missing"});
    }

    const existingUser = await userModel.findOne({ email });

    if(existingUser) {
        return res.status(400).json({ code: 400, success: false, message: "user already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
        name,
        email,
        password: hashedPassword,
        profilePic,
        role
    })

    await user.save();

    return res.status(200).json({ code: 200, success: true, message: "user created successfully", data: user });
})


export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ code: 400, success: false, message: "email and password is required"})
    }

    const existUser = await userModel.findOne({ email });

    if(!existUser){
        return res.status(400).json({ code: 400, success: false, message: "user not found" });
    }

    if(existUser.role === 'doctor' && existUser.isVerified === false) {
        return res.status(400).json({ code: 400, success: false, message: "doctor not verify please contact admin"})
    }

    const isMatch = await bcrypt.compare(password, existUser.password)

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

    const token = jwt.sign({ user_id: existUser._id, user_role: existUser.role }, jwtSecret, { expiresIn: '90d' });

    existUser.accessToken = token;
    await existUser.save();

    return res.status(200).json({ code: 200, success: true, message: "login successfully", data: existUser });
})

export const changeUserPassword = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ code: 400, success: false, message: 'Both current and new passwords are required.' });
    }

    const userId = req.userID;

    const user = await userModel.findById(userId)
    if (!user) {
        return res.status(404).json({ code: 404, success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(401).json({ code: 401, success: false, message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ code: 200, success: true, message: 'Password changed successfully', data: user });
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

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'User not found.'
        });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const otpExpiry  = new Date(Date.now() + 10 * 60 * 1000); // 1 minute from now

    await sendOtpEmail(email, otp);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    res.status(200).json({
        code: 200,
        success: true,
        message: 'OTP sent to your registered email.',
        otp: otp
    });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if(!user) {
        return res.status(400).json({ code: 400, success: false, message: 'User not found.' });
    }

    if ( user.otpExpiry && (user.otp !== otp || new Date() > user.otpExpiry)) {
        return res.status(400).json({ code: 400, success: false, message: 'Invalid OTP.' });
    }

    user.otpVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ code: 200, success: true, message: 'OTP verify successfully' })
})

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await userModel.findOne({ email });

    if(!user) {
        return res.status(400).json({ code: 400, success: false, message: "user not found" });
    }

    if (newPassword!== confirmPassword) {
        return res.status(400).json({ code: 400, success: false, message: 'Passwords do not match.' });
    }

    if(!user.otpVerified){
        return res.status(400).json({ code: 400, success: false, message: 'Please verify otp then reset password'})
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otpVerified = false;
    await user.save();
    res.status(200).json({ code: 200, success: true, message: 'Password reset successfully' });
})
