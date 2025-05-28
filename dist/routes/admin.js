"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const jwt_1 = require("../middlewares/jwt");
const auth_1 = require("../controllers/admin/auth");
const product_1 = require("../controllers/admin/product");
const user_1 = require("../controllers/admin/user");
const order_1 = require("../controllers/admin/order");
const revenue_1 = require("../controllers/admin/revenue");
// auth
router.post('/auth/registerAdmin', auth_1.registerAdmin);
router.post('/auth/loginAdmin', auth_1.loginAdmin);
router.post('/auth/changeAdminPassword', jwt_1.isAdminLoggedIn, auth_1.changeAdminPassword);
router.post('/auth/forgotPassword', auth_1.forgotPassword);
router.post('/auth/verifyOtp', auth_1.verifyOtp);
router.post('/auth/resetPassword', auth_1.resetPassword);
// product
router.post('/product/addProduct', jwt_1.isAdminLoggedIn, product_1.addProduct);
router.get('/product/getProductDetails', jwt_1.isAdminLoggedIn, product_1.getProductDetails);
router.get('/product/getAllProducts', jwt_1.isAdminLoggedIn, product_1.getAllProducts);
router.put('/product/editProduct', jwt_1.isAdminLoggedIn, product_1.editProduct);
router.put('/product/deleteProduct', jwt_1.isAdminLoggedIn, product_1.deleteProduct);
router.put('/product/updateProductAvailability', jwt_1.isAdminLoggedIn, product_1.updateProductAvailability);
// user
router.post('/user/verifyDoctor', jwt_1.isAdminLoggedIn, user_1.verifyDoctor);
router.post('/user/changeBlockStatus', jwt_1.isAdminLoggedIn, user_1.changeBlockStatus);
router.get('/user/getAllUsers', jwt_1.isAdminLoggedIn, user_1.getAllUsers);
router.get('/user/getUserDetails', jwt_1.isAdminLoggedIn, user_1.getUserDetails);
// order
router.get('/order/getAllOrders', jwt_1.isAdminLoggedIn, order_1.getAllOrders);
router.get('/order/getOrderDetails', jwt_1.isAdminLoggedIn, order_1.getOrderDetails);
// revenue
router.get('/revenue/getDailySalesDetails', jwt_1.isAdminLoggedIn, revenue_1.getDailySalesDetails);
exports.default = router;
