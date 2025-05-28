"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductAvailability = exports.deleteProduct = exports.editProduct = exports.getAllProducts = exports.getProductDetails = exports.addProduct = void 0;
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const product_1 = __importDefault(require("../../models/product"));
exports.addProduct = (0, errorHandler_1.default)(async (req, res) => {
    const { productName, productType, numOfTablets, quantity, price, patientDiscountPrice, patientDiscountPercentage, doctorDiscountPrice, doctorDiscountPercentage, productImage, description } = req.body;
    if (!productName || !quantity || !price) {
        return res.status(400).json({ message: "productName, quantity, and price are required." });
    }
    let patDisPrice = patientDiscountPrice;
    let patDisPercent = patientDiscountPercentage;
    let docDisPrice = doctorDiscountPrice;
    let docDisPercent = doctorDiscountPercentage;
    if (patientDiscountPrice && !patientDiscountPercentage) {
        patDisPercent = Number((((price - patientDiscountPrice) / price) * 100).toFixed(2));
    }
    else if (!patientDiscountPrice && patientDiscountPercentage) {
        patDisPrice = Number((price - (price * patientDiscountPercentage / 100)).toFixed(2));
    }
    if (doctorDiscountPrice && !doctorDiscountPercentage) {
        docDisPercent = Number((((price - doctorDiscountPrice) / price) * 100).toFixed(2));
    }
    else if (!doctorDiscountPrice && doctorDiscountPercentage) {
        docDisPrice = Number((price - (price * doctorDiscountPercentage / 100)).toFixed(2));
    }
    const newProduct = new product_1.default({
        productName,
        productType,
        numOfTablets,
        quantity,
        stock: quantity,
        price,
        patientDiscountPrice: patDisPrice,
        patientDiscountPercentage: patDisPercent,
        doctorDiscountPrice: docDisPrice,
        doctorDiscountPercentage: docDisPercent,
        productImage,
        description
    });
    await newProduct.save();
    res.status(200).json({
        code: 200,
        success: true,
        message: "Product added successfully",
        data: newProduct
    });
});
exports.getProductDetails = (0, errorHandler_1.default)(async (req, res) => {
    const { productId } = req.query;
    if (!productId) {
        return res.status(400).json({ code: 400, success: false, message: "productId is required" });
    }
    const product = await product_1.default.findById(productId);
    if (!product) {
        return res.status(404).json({ code: 404, success: false, message: "Product not found" });
    }
    res.status(200).json({ code: 200, success: true, message: "Product details", data: product });
});
exports.getAllProducts = (0, errorHandler_1.default)(async (req, res) => {
    const products = await product_1.default.aggregate([
        {
            $match: {
            // isDeleted: false
            }
        }
    ]);
    if (!products) {
        return res.status(404).json({ code: 404, success: false, message: "Product not found" });
    }
    res.status(200).json({ code: 200, success: true, message: "Product details", data: products });
});
exports.editProduct = (0, errorHandler_1.default)(async (req, res) => {
    const { productId, productName, productType, numOfTablets, quantity, price, patientDiscountPrice, patientDiscountPercentage, doctorDiscountPrice, doctorDiscountPercentage, productImage, description } = req.body;
    const existingProduct = await product_1.default.findById(productId);
    if (!existingProduct) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: "Product not found",
        });
    }
    let patDisPrice = patientDiscountPrice;
    let patDisPercent = patientDiscountPercentage;
    let docDisPrice = doctorDiscountPrice;
    let docDisPercent = doctorDiscountPercentage;
    // Recalculate if one of the pair is missing
    if (patientDiscountPrice && !patientDiscountPercentage) {
        patDisPercent = Number((((price - patientDiscountPrice) / price) * 100).toFixed(2));
    }
    else if (!patientDiscountPrice && patientDiscountPercentage) {
        patDisPrice = Number((price - (price * patientDiscountPercentage / 100)).toFixed(2));
    }
    if (doctorDiscountPrice && !doctorDiscountPercentage) {
        docDisPercent = Number((((price - doctorDiscountPrice) / price) * 100).toFixed(2));
    }
    else if (!doctorDiscountPrice && doctorDiscountPercentage) {
        docDisPrice = Number((price - (price * doctorDiscountPercentage / 100)).toFixed(2));
    }
    // Update fields
    existingProduct.productName = productName;
    existingProduct.productType = productType;
    existingProduct.numOfTablets = numOfTablets;
    existingProduct.quantity = quantity;
    existingProduct.stock = quantity; // stock reset to new quantity
    existingProduct.price = price;
    existingProduct.patientDiscountPrice = patDisPrice;
    existingProduct.patientDiscountPercentage = patDisPercent;
    existingProduct.doctorDiscountPrice = docDisPrice;
    existingProduct.doctorDiscountPercentage = docDisPercent;
    existingProduct.productImage = productImage;
    existingProduct.description = description;
    const updatedProduct = await existingProduct.save();
    res.status(200).json({
        code: 200,
        success: true,
        message: "Product updated successfully",
        data: updatedProduct
    });
});
exports.deleteProduct = (0, errorHandler_1.default)(async (req, res) => {
    const { productId } = req.body;
    const deletedProduct = await product_1.default.findOneAndUpdate({ _id: productId }, { isDeleted: true }, { new: true });
    if (!deletedProduct) {
        return res.status(404).json({
            code: 404,
            success: false,
            message: "Product not found",
        });
    }
    res.status(200).json({
        code: 200,
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct,
    });
});
exports.updateProductAvailability = (0, errorHandler_1.default)(async (req, res) => {
    const { productId, status } = req.body;
    const productStatus = await product_1.default.findOneAndUpdate({ _id: productId }, { isAvailable: status }, { new: true });
    if (!productStatus) {
        return res.status(404).json({
            code: 404,
            success: false,
            message: "Product not found",
        });
    }
    res.status(200).json({
        code: 200,
        success: true,
        message: "productStatus change successfully",
        data: productStatus,
    });
});
