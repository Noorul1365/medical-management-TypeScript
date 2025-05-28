import mongoose , { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    productName: string;
    productType?: string;
    numOfTablets?: number;
    quantity: number;
    stock: number;
    price?: number;
    patientDiscountPrice?: number;
    patientDiscountPercentage?: number;
    doctorDiscountPrice?: number;
    doctorDiscountPercentage?: number;
    productImage?: string;
    description?: string;
    isAvailable: boolean;
    isDeleted: boolean
}

const productSchema: Schema = new Schema({
    productName: {
        type: String,
        required: true,
    },
    productType: {
        type: String,
        enum: ["syrup", "tablet", "capsule", "drop", "injuction", ]
    },
    numOfTablets: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true,
    },
    patientDiscountPrice: {
        type: Number
    },
    patientDiscountPercentage: {
        type: Number
    },
    doctorDiscountPrice: {
        type: Number
    },
    doctorDiscountPercentage: {
        type: Number
    },
    productImage: {
        type: String,
    },
    description: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


export default mongoose.model<IProduct>("product", productSchema);