"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.generateAndSendOtp = exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Store OTPs temporarily in memory (for demo purposes)
const otpStore = {};
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // OTP valid for 5 minutes
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD, // Use environment variables for sensitive info
    },
});
const sendOtpEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
    };
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw new Error("Failed to send OTP email");
    }
});
exports.sendOtpEmail = sendOtpEmail;
// Generate and send a dynamic OTP
const generateAndSendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store OTP and expiration time
    otpStore[email] = {
        otp,
        expiresAt: Date.now() + OTP_EXPIRATION_TIME, // Set expiration time
    };
    // Send OTP to user's email
    yield (0, exports.sendOtpEmail)(email, otp);
});
exports.generateAndSendOtp = generateAndSendOtp;
// Verify OTP entered by the user
const verifyOtp = (email, otp) => {
    const storedOtp = otpStore[email];
    // Check if OTP exists and if it's not expired
    if (!storedOtp || Date.now() > storedOtp.expiresAt) {
        return false; // OTP expired or not found
    }
    // Check if OTP matches
    return storedOtp.otp === otp;
};
exports.verifyOtp = verifyOtp;
