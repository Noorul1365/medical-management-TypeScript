import userModel from "../../models/user";
import mongoose from 'mongoose';
import { Request, Response } from "express";
import asyncHandler from "../../utils/errorHandler";
import productModel from "../../models/product";

export const getAllProducts = asyncHandler( async (req: Request, res: Response) => {
    const role = req.userRole;
    const userId = req.userID;

    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ code: "404", success: false, message: "User not found" });
    }

    if (!role || (role !== "doctor" && role !== "patient")) {
      return res.status(400).json({ message: "Invalid user role" });
    }

    const products = await productModel.find({
      isDeleted: false,
      isAvailable: true,
    });

    const formattedProducts = products.map((product) => {
      let discountPrice: number | undefined;
      let discountPercentage: number | undefined;

      if (role === "doctor") {
        discountPrice = product.doctorDiscountPrice;
        discountPercentage = product.doctorDiscountPercentage;
      } else if (role === "patient") {
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
  }
);

export const getProductDetails = asyncHandler( async (req: Request, res: Response) => {
    const { productId } = req.query;

    // const objId = new mongoose.Types.ObjectId(productId as string); 
    
    const role = req.userRole;
    const userId = req.userID;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ code: "404", success: false, message: "User not found" });
    }

    // if (!mongoose.Types.ObjectId.isValid(objId)) {
    //   return res.status(400).json({ message: "Invalid product ID" });
    // }
 
    if (!role || (role !== "doctor" && role !== "patient")) {
      return res.status(400).json({ message: "Invalid user role" });
    }


    const product = await productModel.findOne({
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

    return res.status(200).json({ code: 200, success: true, message: "Product fetched successfully", data : response });
  }
);
