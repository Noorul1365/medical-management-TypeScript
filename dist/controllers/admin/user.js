"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeBlockStatus = exports.verifyDoctor = exports.getUserDetails = exports.getAllUsers = void 0;
const user_1 = __importDefault(require("../../models/user"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
exports.getAllUsers = (0, errorHandler_1.default)(async (req, res) => {
    const { userType } = req.query;
    if (!userType) {
        return res.status(400).json({ code: 400, success: false, message: "userType is required" });
    }
    const users = await user_1.default.aggregate([
        {
            $match: {
                role: userType
            }
        }
    ]);
    if (!users) {
        return res.status(404).json({ code: 404, success: false, message: "No users found" });
    }
    return res.status(200).json({ code: 200, success: true, data: users });
});
exports.getUserDetails = (0, errorHandler_1.default)(async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ code: 400, success: false, message: "userId is required" });
    }
    const user = await user_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ code: 404, success: false, message: "User not found" });
    }
    return res.status(200).json({ code: 200, success: true, data: user });
});
exports.verifyDoctor = (0, errorHandler_1.default)(async (req, res) => {
    const { doctorId } = req.body;
    if (!doctorId) {
        return res.status(400).json({ code: 400, success: false, message: "doctorId is required" });
    }
    const doctor = await user_1.default.findById(doctorId);
    if (!doctor) {
        return res.status(404).json({ code: 404, success: false, message: "Doctor not found" });
    }
    doctor.isVerified = true;
    await doctor.save();
    return res.status(200).json({ code: 200, success: true, message: "Doctor verified successfully" });
});
exports.changeBlockStatus = (0, errorHandler_1.default)(async (req, res) => {
    const { userId, status } = req.body;
    if (!userId) {
        return res.status(400).json({ code: 400, success: false, message: "userId and status is required" });
    }
    const user = await user_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ code: 404, success: false, message: "user not found" });
    }
    user.isBlocked = status;
    await user.save();
    return res.status(200).json({ code: 200, success: true, message: "user status changed successfully" });
});
