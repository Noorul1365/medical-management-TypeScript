import express from 'express';
const router = express.Router();

import { isUserLoggedIn }from '../middlewares/jwt'
import { registerUser, loginUser, changeUserPassword, forgotPassword, verifyOtp, resetPassword } from "../controllers/user/auth";
import { getAllProducts, getProductDetails } from "../controllers/user/product";
import { purchaseProduct } from "../controllers/user/order";


// auth
router.post("/auth/registerUser", registerUser)
router.post("/auth/loginUser", loginUser)
router.post("/auth/changeUserPassword", isUserLoggedIn, changeUserPassword)
router.post("/auth/forgotPassword", forgotPassword)
router.post("/auth/verifyOtp", verifyOtp)
router.post("/auth/resetPassword", resetPassword)

// product
router.get("/product/getAllProducts", isUserLoggedIn, getAllProducts)
router.get("/product/getProductDetails", isUserLoggedIn, getProductDetails)

// order
router.post("/order/purchaseProduct", isUserLoggedIn, purchaseProduct)

export default router;