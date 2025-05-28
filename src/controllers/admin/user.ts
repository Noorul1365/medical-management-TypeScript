import userModel from '../../models/user';
import { Request, Response } from "express";
import asyncHandler from '../../utils/errorHandler';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const { userType } = req.query;

    if(!userType){
        return res.status(400).json({ code: 400, success: false, message: "userType is required" });
    }

    const users = await userModel.aggregate([
        {
            $match: {
                role: userType
            }
        }
    ])

    if (!users) {
        return res.status(404).json({ code: 404, success: false, message: "No users found" });
    }

    return res.status(200).json({ code: 200, success: true, data: users });
})

export const getUserDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;

    if(!userId){
        return res.status(400).json({ code: 400, success: false, message: "userId is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ code: 404, success: false, message: "User not found" });
    }

    return res.status(200).json({ code: 200, success: true, data: user });
})

export const verifyDoctor = asyncHandler(async (req: Request, res: Response) => {
    const { doctorId } = req.body;

    if(!doctorId){
        return res.status(400).json({ code: 400, success: false, message: "doctorId is required" });
    }

    const doctor = await userModel.findById(doctorId);
    if (!doctor) {
        return res.status(404).json({ code: 404, success: false, message: "Doctor not found" });
    }

    doctor.isVerified = true;
    await doctor.save();

    return res.status(200).json({ code: 200, success: true, message: "Doctor verified successfully" });
})

export const changeBlockStatus = asyncHandler(async (req: Request, res: Response) => {
    const { userId, status } = req.body;

    if(!userId){
        return res.status(400).json({ code: 400, success: false, message: "userId and status is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ code: 404, success: false, message: "user not found" });
    }

    user.isBlocked = status;
    await user.save();

    return res.status(200).json({ code: 200, success: true, message: "user status changed successfully" });
})