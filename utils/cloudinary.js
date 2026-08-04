
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");




// cloudinary.config({
//   cloud_name:"dqdcdbd1n",
//   api_key:"416918561356881",
//   api_secret:"WTjrAra31rCdfn6a_nK18cj1ghs",
// });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "GharKharido",
    allowedFormats: ["png", "jpg", "jpeg","webp"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      cb(new Error("Only image files are allowed"), false);
    } else {
      cb(null, true);
    }
  },
});


module.exports = {
  cloudinary,
  storage,
  upload,
};
