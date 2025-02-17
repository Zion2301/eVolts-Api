import nodemailer from "nodemailer";

// Store OTPs temporarily in memory (for demo purposes)
const otpStore: { [key: string]: { otp: string, expiresAt: number } } = {}; 
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // OTP valid for 5 minutes

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // Use environment variables for sensitive info
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send OTP email");
  }
};

// Generate and send a dynamic OTP
export const generateAndSendOtp = async (email: string) => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP and expiration time
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + OTP_EXPIRATION_TIME, // Set expiration time
  };

  // Send OTP to user's email
  await sendOtpEmail(email, otp);
};

// Verify OTP entered by the user
export const verifyOtp = (email: string, otp: string): boolean => {
  const storedOtp = otpStore[email];

  // Check if OTP exists and if it's not expired
  if (!storedOtp || Date.now() > storedOtp.expiresAt) {
    return false; // OTP expired or not found
  }

  // Check if OTP matches
  return storedOtp.otp === otp;
};
