import orderModel from "../../models/order";
import productModel from "../../models/product";
import adminModel from "../../models/admin";
import { Request, Response } from "express";
import asyncHandler from "../../utils/errorHandler";

export const getDailySalesDetails = asyncHandler(async (req: Request, res: Response) => {
    const { date, startDate, endDate } = req.query;

    const now = new Date();
    const targetDate = date ? new Date(date as string) : now;

    // Day Range
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Week Range
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Month Range
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);

    // Year Range
    const startOfYear = new Date(targetDate.getFullYear(), 0, 1);
    const endOfYear = new Date(targetDate.getFullYear(), 11, 31, 23, 59, 59, 999);

    // Custom Range
    let customRangeOrders: any[] = [];
    if (startDate && endDate) {
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);

        customRangeOrders = await orderModel.find({
            createdAt: { $gte: start, $lte: end }
        });
    }

    // Queries
    const [dailyOrders, weeklyOrders, monthlyOrders, yearlyOrders] = await Promise.all([
        orderModel.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
        orderModel.find({ createdAt: { $gte: startOfWeek, $lte: endOfWeek } }),
        orderModel.find({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
        orderModel.find({ createdAt: { $gte: startOfYear, $lte: endOfYear } })
    ]);

    const calcRevenue = (orders: any[]) =>
        orders.reduce((sum, order) => sum + (order.totalDiscountPrice || 0), 0);

    return res.status(200).json({
        code: 200,
        success: true,
        daily: {
            date: startOfDay.toDateString(),
            totalOrders: dailyOrders.length,
            totalRevenue: calcRevenue(dailyOrders)
        },
        weekly: {
            totalOrders: weeklyOrders.length,
            totalRevenue: calcRevenue(weeklyOrders)
        },
        monthly: {
            totalOrders: monthlyOrders.length,
            totalRevenue: calcRevenue(monthlyOrders)
        },
        yearly: {
            totalOrders: yearlyOrders.length,
            totalRevenue: calcRevenue(yearlyOrders)
        },
        customRange: startDate && endDate ? {
            startDate,
            endDate,
            totalOrders: customRangeOrders.length,
            totalRevenue: calcRevenue(customRangeOrders)
        } : null
    });
}) 