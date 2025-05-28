"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserLoggedIn = exports.isAdminLoggedIn = void 0;
const admin_1 = __importDefault(require("../models/admin"));
const user_1 = __importDefault(require("../models/user"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.isAdminLoggedIn = (0, errorHandler_1.default)(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ code: 400, success: false, message: "No token provided" });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
    if (!decodedToken) {
        return res.status(400).send({ code: 400, message: "Failed to authenticate token" });
    }
    if (!decodedToken.admin_id) {
        return res.status(400).send({
            code: 400,
            message: "Cannot find admin_id in decoded token",
        });
    }
    const foundAdmin = await admin_1.default.findById(decodedToken.admin_id);
    if (!foundAdmin) {
        return res.status(400).send({ code: 400, message: "Admin not found" });
    }
    req.adminID = decodedToken.admin_id;
    req.adminRole = decodedToken.admin_role;
    next();
});
exports.isUserLoggedIn = (0, errorHandler_1.default)(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ code: 400, success: false, message: "No token provided" });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
    if (!decodedToken) {
        return res.status(400).send({ code: 400, message: "Failed to authenticate token" });
    }
    if (!decodedToken.user_id) {
        return res.status(400).send({
            code: 400,
            message: "Cannot find admin_id in decoded token",
        });
    }
    const foundUser = await user_1.default.findById(decodedToken.user_id);
    if (!foundUser) {
        return res.status(400).send({ code: 400, message: "User not found" });
    }
    req.userID = decodedToken.user_id;
    req.userRole = decodedToken.user_role;
    next();
});
