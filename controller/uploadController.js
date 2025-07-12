require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("🌐 Cloudinary Config:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
   

// Set up storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads_folder",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
  

const upload = multer({ storage }).single("image");
// console.log("✅ Multer + Cloudinary upload middleware ready.");


exports.upload = upload;

