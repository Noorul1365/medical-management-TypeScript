import mongoose, { Schema } from "mongoose";

export interface IOrder extends Document {
    userId: string;
    productId: string;
    qauntity: number;
    totalPrice: number;
    totalDiscountPrice: number;
    orderDate: Date;
}
 

const orderSchema : Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model<IOrder>('order', orderSchema);