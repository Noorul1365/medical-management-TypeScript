"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP Sent',
        text: `Welcome!\n\nEmail: ${email}\nOTP: ${otp}`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully: ${otp}`);
    }
    catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Failed to send email');
    }
};
exports.sendOtpEmail = sendOtpEmail;
