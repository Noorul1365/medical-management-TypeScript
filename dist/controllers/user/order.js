"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseProduct = void 0;
const order_1 = __importDefault(require("../../models/order"));
const user_1 = __importDefault(require("../../models/user"));
const product_1 = __importDefault(require("../../models/product"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
exports.purchaseProduct = (0, errorHandler_1.default)(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userID;
    const role = req.userRole;
    if (!productId || !quantity) {
        return res.status(400).json({ code: 400, success: false, message: "ProductId and quantity are required." });
    }
    const user = await user_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ code: 404, success: false, message: "User not found." });
    }
    const product = await product_1.default.findById(productId);
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
    }
    else if (role === "doctor" && product.doctorDiscountPrice) {
        discountedPricePerUnit = product.doctorDiscountPrice;
    }
    const totalPrice = product?.price || 0 * quantity;
    const totalDiscountPrice = discountedPricePerUnit * quantity;
    // console.log(quantity);
    const newOrder = new order_1.default({
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
});
