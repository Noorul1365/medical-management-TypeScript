import express from 'express';
const router = express.Router();

import { isAdminLoggedIn }from '../middlewares/jwt'
import { registerAdmin, loginAdmin, changeAdminPassword, forgotPassword, verifyOtp, resetPassword } from "../controllers/admin/auth";
import { addProduct, getProductDetails, getAllProducts, editProduct, deleteProduct, updateProductAvailability } from "../controllers/admin/product";
import { verifyDoctor, changeBlockStatus, getAllUsers, getUserDetails } from "../controllers/admin/user";
import { getAllOrders, getOrderDetails } from "../controllers/admin/order";
import { getDailySalesDetails } from "../controllers/admin/revenue";

// auth
router.post('/auth/registerAdmin', registerAdmin);
router.post('/auth/loginAdmin', loginAdmin);
router.post('/auth/changeAdminPassword', isAdminLoggedIn, changeAdminPassword);
router.post('/auth/forgotPassword', forgotPassword);
router.post('/auth/verifyOtp', verifyOtp);
router.post('/auth/resetPassword', resetPassword);

// product

router.post('/product/addProduct', isAdminLoggedIn, addProduct);
router.get('/product/getProductDetails', isAdminLoggedIn, getProductDetails);
router.get('/product/getAllProducts', isAdminLoggedIn, getAllProducts);
router.put('/product/editProduct', isAdminLoggedIn, editProduct);
router.put('/product/deleteProduct', isAdminLoggedIn, deleteProduct);
router.put('/product/updateProductAvailability', isAdminLoggedIn, updateProductAvailability);

// user
router.post('/user/verifyDoctor', isAdminLoggedIn, verifyDoctor);
router.post('/user/changeBlockStatus', isAdminLoggedIn, changeBlockStatus);
router.get('/user/getAllUsers', isAdminLoggedIn, getAllUsers);
router.get('/user/getUserDetails', isAdminLoggedIn, getUserDetails);

// order
router.get('/order/getAllOrders', isAdminLoggedIn, getAllOrders);
router.get('/order/getOrderDetails', isAdminLoggedIn, getOrderDetails);

// revenue
router.get('/revenue/getDailySalesDetails', isAdminLoggedIn, getDailySalesDetails);

export default router;