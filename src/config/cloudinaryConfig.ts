import multer, { FileFilterCallback } from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for profile image uploads
const profileImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file: Express.Multer.File) => {
        const timestamp = Date.now();
        const fileName = file.originalname.split(".")[0];

        return {
            folder: "Pictures", // Cloudinary folder for medication images
            public_id: `${fileName}-${timestamp}`, // Unique filename
            resource_type: "image",
        };
    },
});

// Multer configuration for profile image uploads
const uploadProfileImage = multer({
    storage: profileImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maximum file size of 5MB
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
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
    export const uploadToCloudinaryMedicationImage = (req: Request, res: Response, next: NextFunction): void => {
        uploadProfileImage.single("medicationImage")(req, res, (err: any) => {
            if (err) {
                console.error("Multer Error:", err.message);
                return res.status(500).json({ error: "Multer Error", details: err.message });
            }
    
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
    
            // Get Cloudinary URL properly
            const uploadedUrl = (req.file as any).path || (req.file as any).secure_url;
            
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