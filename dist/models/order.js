"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'product'
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number
    },
    totalDiscountPrice: {
        type: Number
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('order', orderSchema);
