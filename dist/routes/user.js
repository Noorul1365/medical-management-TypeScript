"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const jwt_1 = require("../middlewares/jwt");
const auth_1 = require("../controllers/user/auth");
const product_1 = require("../controllers/user/product");
const order_1 = require("../controllers/user/order");
// auth
router.post("/auth/registerUser", auth_1.registerUser);
router.post("/auth/loginUser", auth_1.loginUser);
router.post("/auth/changeUserPassword", jwt_1.isUserLoggedIn, auth_1.changeUserPassword);
router.post("/auth/forgotPassword", auth_1.forgotPassword);
router.post("/auth/verifyOtp", auth_1.verifyOtp);
router.post("/auth/resetPassword", auth_1.resetPassword);
// product
router.get("/product/getAllProducts", jwt_1.isUserLoggedIn, product_1.getAllProducts);
router.get("/product/getProductDetails", jwt_1.isUserLoggedIn, product_1.getProductDetails);
// order
router.post("/order/purchaseProduct", jwt_1.isUserLoggedIn, order_1.purchaseProduct);
exports.default = router;
