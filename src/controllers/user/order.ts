import mongoose from "mongoose";
import orderModel from "../../models/order";
import userModel from "../../models/user";
import productModel from "../../models/product";
import { Request, Response } from "express";
import asyncHandler from "../../utils/errorHandler";

export const purchaseProduct = asyncHandler(async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const userId = req.userID;
    const role = req.userRole;

    if (!productId || !quantity) {
        return res.status(400).json({ code: 400, success: false, message: "ProductId and quantity are required." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ code: 404, success: false, message: "User not found." });
    }

    const product = await productModel.findById(productId);

    if (!product || product.isDeleted || !product.isAvailable) {
        return res.status(404).json({ code: 404, success: false, message: "Product not found or unavailable." });
    }

    if (product.stock < quantity) {
        return res.status(400).json({ code: 400, success: false, message: "Insufficient stock." });
    }

        // Determine discount price based on user type
    let discountedPricePerUnit = product?.price || 0;

    if (role === "patient" && product.patientDiscountPrice) {
        discountedPricePerUnit = product.patientDiscountPrice;
    } else if (role === "doctor" && product.doctorDiscountPrice) {
        discountedPricePerUnit = product.doctorDiscountPrice;
    }

    const totalPrice =  product?.price || 0 * quantity;
    const totalDiscountPrice = discountedPricePerUnit * quantity;

    // console.log(quantity);

    const newOrder = new orderModel({
        userId,
        productId,
        quantity,
        totalPrice,
        totalDiscountPrice
    });

    await newOrder.save();

        // Decrease stock
    product.stock -= quantity;
    await product.save();

    return res.status(200).json({ code: 200, success: true, message: "Order placed successfully", data: newOrder });
})