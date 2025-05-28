import orderModel from "../../models/order";
import { Request, Response } from "express";
import asyncHandler from "../../utils/errorHandler";
import mongoose from "mongoose";

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await orderModel.find()
    .populate("userId", "name email role")
    .populate("productId", "productName productType")
    return res.status(200).json({ code: 200, success: true, data: orders });
})

export const getOrderDetails = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.query;

    if(!orderId || typeof orderId !== "string"){
        return res.status(400).json({ code: 400, success: false, message: "orderId is required" });
    }

    const order = await orderModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(orderId)
            }
        }
    ])

    if(!order || order.length === 0){
        return res.status(404).json({ code: 404, success: false, message: "Order not found" });
    }

    return res.status(200).json({ code: 200, success: true, data: order[0] });
})