"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderDetails = exports.getAllOrders = void 0;
const order_1 = __importDefault(require("../../models/order"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.getAllOrders = (0, errorHandler_1.default)(async (req, res) => {
    const orders = await order_1.default.find()
        .populate("userId", "name email role")
        .populate("productId", "productName productType");
    return res.status(200).json({ code: 200, success: true, data: orders });
});
exports.getOrderDetails = (0, errorHandler_1.default)(async (req, res) => {
    const { orderId } = req.query;
    if (!orderId || typeof orderId !== "string") {
        return res.status(400).json({ code: 400, success: false, message: "orderId is required" });
    }
    const order = await order_1.default.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(orderId)
            }
        }
    ]);
    if (!order || order.length === 0) {
        return res.status(404).json({ code: 404, success: false, message: "Order not found" });
    }
    return res.status(200).json({ code: 200, success: true, data: order[0] });
});
