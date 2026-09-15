import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const profileUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error("Only JPG, PNG and WebP images are allowed"));
    }

    cb(null, true);
  },
});

export default profileUpload;
