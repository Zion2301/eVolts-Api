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
exports.uploadToCloudinaryMedicationImage = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Configure Cloudinary storage for profile image uploads
const profileImageStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const timestamp = Date.now();
        const fileName = file.originalname.split(".")[0];
        return {
            folder: "Pictures", // Cloudinary folder for medication images
            public_id: `${fileName}-${timestamp}`, // Unique filename
            resource_type: "image",
        };
    }),
});
// Multer configuration for profile image uploads
const uploadProfileImage = (0, multer_1.default)({
    storage: profileImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maximum file size of 5MB
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = /image\/(jpeg|png|jpg|gif|webp)/i;
        if (!allowedImageTypes.test(file.mimetype)) {
            const error = new Error('Only JPG, JPEG, PNG, GIF, and WEBP files are allowed');
            return cb(null, false); // Return error if file type is invalid
        }
        cb(null, true); // Proceed with valid image type
    },
});
// Upload middleware that attaches the Cloudinary URL to the request
// export const uploadToCloudinaryMedicationImage = (req: Request, res: Response, next: NextFunction): void => {
const uploadToCloudinaryMedicationImage = (req, res, next) => {
    uploadProfileImage.single("medicationImage")(req, res, (err) => {
        if (err) {
            console.error("Multer Error:", err.message);
            return res.status(500).json({ error: "Multer Error", details: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        // Get Cloudinary URL properly
        const uploadedUrl = req.file.path || req.file.secure_url;
        if (!uploadedUrl) {
            return res.status(500).json({ error: "Upload failed", details: "Cloudinary did not return a valid URL" });
        }
        // Attach Cloudinary URL to request object
        req.uploadedImageUrl = uploadedUrl;
        console.log("File uploaded successfully:", uploadedUrl);
        // Send success response
        return res.status(200).json({ success: true, imageUrl: uploadedUrl });
    });
};
exports.uploadToCloudinaryMedicationImage = uploadToCloudinaryMedicationImage;
// export const uploadToCloudinaryMedicationImage = (req: Request, res: Response, next: NextFunction): void => {
//     // If an image URL is provided in the request body, skip the upload process
//     if (req.body.image) {
//         req.uploadedImageUrl = req.body.image;
//         console.log("Using provided image URL:", req.uploadedImageUrl);
//         return next(); // Move to the next middleware/controller
//     }
//     // Otherwise, handle file upload
//     uploadProfileImage.single("medicationImage")(req, res, (err: any) => {
//         if (err) {
//             console.error("Multer Error:", err.message);
//             return res.status(500).json({ error: "Multer Error", details: err.message });
//         }
//         if (!req.file) {
//             return res.status(400).json({ error: "No file uploaded" });
//         }
//         // Get Cloudinary URL properly
//         const uploadedUrl = (req.file as any).path || (req.file as any).secure_url;
//         if (!uploadedUrl) {
//             return res.status(500).json({ error: "Upload failed", details: "Cloudinary did not return a valid URL" });
//         }
//         // Attach Cloudinary URL to request object
//         req.uploadedImageUrl = uploadedUrl;
//         console.log("File uploaded successfully:", uploadedUrl);
//         // Continue to the next middleware/controller instead of sending a response
//         next();
//     });
// };
