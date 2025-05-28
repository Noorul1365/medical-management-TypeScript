"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductDetails = exports.getAllProducts = void 0;
const user_1 = __importDefault(require("../../models/user"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const product_1 = __importDefault(require("../../models/product"));
exports.getAllProducts = (0, errorHandler_1.default)(async (req, res) => {
    const role = req.userRole;
    const userId = req.userID;
    const user = await user_1.default.findById(userId);
    if (!user) {
        return res
            .status(404)
            .json({ code: "404", success: false, message: "User not found" });
    }
    if (!role || (role !== "doctor" && role !== "patient")) {
        return res.status(400).json({ message: "Invalid user role" });
    }
    const products = await product_1.default.find({
        isDeleted: false,
        isAvailable: true,
    });
    const formattedProducts = products.map((product) => {
        let discountPrice;
        let discountPercentage;
        if (role === "doctor") {
            discountPrice = product.doctorDiscountPrice;
            discountPercentage = product.doctorDiscountPercentage;
        }
        else if (role === "patient") {
            discountPrice = product.patientDiscountPrice;
            discountPercentage = product.patientDiscountPercentage;
        }
        return {
            _id: product._id,
            productName: product.productName,
            productType: product.productType,
            numOfTablets: product.numOfTablets,
            quantity: product.quantity,
            stock: product.stock,
            price: product.price,
            discountPrice,
            discountPercentage,
            productImage: product.productImage,
            description: product.description,
            isAvailable: product.isAvailable,
        };
    });
    return res
        .status(200)
        .json({
        code: 200,
        success: true,
        message: "prodcut fetched successfully",
        data: formattedProducts,
    });
});
exports.getProductDetails = (0, errorHandler_1.default)(async (req, res) => {
    const { productId } = req.query;
    // const objId = new mongoose.Types.ObjectId(productId as string); 
    const role = req.userRole;
    const userId = req.userID;
    const user = await user_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ code: "404", success: false, message: "User not found" });
    }
    // if (!mongoose.Types.ObjectId.isValid(objId)) {
    //   return res.status(400).json({ message: "Invalid product ID" });
    // }
    if (!role || (role !== "doctor" && role !== "patient")) {
        return res.status(400).json({ message: "Invalid user role" });
    }
    const product = await product_1.default.findOne({
        _id: productId,
        isDeleted: false,
        isAvailable: true,
    });
    if (!product) {
        return res.status(404).json({ code: 404, success: false, message: "Product not found" });
    }
    const discountPrice = role === "doctor"
        ? product.doctorDiscountPrice
        : product.patientDiscountPrice;
    const discountPercentage = role === "doctor"
        ? product.doctorDiscountPercentage
        : product.patientDiscountPercentage;
    const response = {
        _id: product._id,
        productName: product.productName,
        productType: product.productType,
        numOfTablets: product.numOfTablets,
        quantity: product.quantity,
        stock: product.stock,
        price: product.price,
        discountPrice,
        discountPercentage,
        productImage: product.productImage,
        description: product.description,
        isAvailable: product.isAvailable,
    };
    return res.status(200).json({ code: 200, success: true, message: "Product fetched successfully", data: response });
});
