"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailySalesDetails = void 0;
const order_1 = __importDefault(require("../../models/order"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
exports.getDailySalesDetails = (0, errorHandler_1.default)(async (req, res) => {
    const { date, startDate, endDate } = req.query;
    const now = new Date();
    const targetDate = date ? new Date(date) : now;
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
    let customRangeOrders = [];
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        customRangeOrders = await order_1.default.find({
            createdAt: { $gte: start, $lte: end }
        });
    }
    // Queries
    const [dailyOrders, weeklyOrders, monthlyOrders, yearlyOrders] = await Promise.all([
        order_1.default.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
        order_1.default.find({ createdAt: { $gte: startOfWeek, $lte: endOfWeek } }),
        order_1.default.find({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
        order_1.default.find({ createdAt: { $gte: startOfYear, $lte: endOfYear } })
    ]);
    const calcRevenue = (orders) => orders.reduce((sum, order) => sum + (order.totalDiscountPrice || 0), 0);
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
});
