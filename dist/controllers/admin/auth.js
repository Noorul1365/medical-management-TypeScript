"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOtp = exports.forgotPassword = exports.changeAdminPassword = exports.loginAdmin = exports.registerAdmin = void 0;
const admin_1 = __importDefault(require("../../models/admin"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendOtp_1 = require("../../utils/sendOtp");
exports.registerAdmin = (0, errorHandler_1.default)(async (req, res) => {
    const { name, email, password, profilePic } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ code: 400, success: false, message: "required field missing" });
    }
    const existingAdmin = await admin_1.default.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({ code: 400, success: false, message: "admin already exist" });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const admin = new admin_1.default({
        name,
        email,
        password: hashedPassword,
        profilePic
    });
    await admin.save();
    return res.status(200).json({ code: 200, success: true, message: "admin created successfully", data: admin });
});
exports.loginAdmin = (0, errorHandler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ code: 400, success: false, message: "email and password is required" });
    }
    const existAdmin = await admin_1.default.findOne({ email });
    if (!existAdmin) {
        return res.status(400).json({ code: 400, success: false, message: "admin not found" });
    }
    const isMatch = await bcrypt_1.default.compare(password, existAdmin.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials.",
        });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jsonwebtoken_1.default.sign({ admin_id: existAdmin._id, admin_role: existAdmin.role }, jwtSecret, { expiresIn: '90d' });
    existAdmin.accessToken = token;
    await existAdmin.save();
    return res.status(200).json({ code: 200, success: true, message: "login successfully", data: existAdmin });
});
exports.changeAdminPassword = (0, errorHandler_1.default)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ code: 400, success: false, message: 'Both current and new passwords are required.' });
    }
    const adminId = req.adminID;
    const admin = await admin_1.default.findById(adminId).select('+password');
    if (!admin) {
        return res.status(404).json({ code: 404, success: false, message: 'Admin not found' });
    }
    const isMatch = await bcrypt_1.default.compare(currentPassword, admin.password);
    if (!isMatch) {
        return res.status(401).json({ code: 401, success: false, message: 'Current password is incorrect' });
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    res.status(200).json({ code: 200, success: true, message: 'Password changed successfully', data: admin });
});
exports.forgotPassword = (0, errorHandler_1.default)(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Email is required.'
        });
    }
    const admin = await admin_1.default.findOne({ email });
    if (!admin) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Admin not found.'
        });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 1 minute from now
    await (0, sendOtp_1.sendOtpEmail)(email, otp);
    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();
    res.status(200).json({
        code: 200,
        success: true,
        message: 'OTP sent to your registered email.',
        otp: otp
    });
});
exports.verifyOtp = (0, errorHandler_1.default)(async (req, res) => {
    const { email, otp } = req.body;
    const admin = await admin_1.default.findOne({ email });
    if (!admin) {
        return res.status(400).json({ code: 400, success: false, message: 'Admin not found.' });
    }
    if (admin.otpExpiry && (admin.otp !== otp || new Date() > admin.otpExpiry)) {
        return res.status(400).json({ code: 400, success: false, message: 'Invalid OTP.' });
    }
    admin.isVerified = true;
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();
    res.status(200).json({ code: 200, success: true, message: 'OTP verify successfully' });
});
exports.resetPassword = (0, errorHandler_1.default)(async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
    const admin = await admin_1.default.findOne({ email });
    if (!admin) {
        return res.status(400).json({ code: 400, success: false, message: "admin not found" });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ code: 400, success: false, message: 'Passwords do not match.' });
    }
    if (!admin.isVerified) {
        return res.status(400).json({ code: 400, success: false, message: 'Please verify otp then reset password' });
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.isVerified = false;
    await admin.save();
    res.status(200).json({ code: 200, success: true, message: 'Password reset successfully' });
});
