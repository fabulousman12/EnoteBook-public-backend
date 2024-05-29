const multer = require('multer');

// Define storage for uploaded images
const storage = multer.memoryStorage();

// Set up multer middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: function (req, file, cb) {
 
    // Allow only images and PDFs
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      console.log('File rejected:', file.mimetype); // Log the rejected file type
      cb(new Error('Please upload an image file'), false);
    }
  },
}).single('image');

// Middleware to handle multer errors
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ errors: [{ msg: err.message }] });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ errors: [{ msg: err.message }] });
    }
    // Everything went fine.
    next();
  });
};

module.exports = uploadMiddleware;
