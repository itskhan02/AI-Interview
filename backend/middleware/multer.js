import crypto from "crypto";
import multer from "multer";
import path from "path";

const allowedMimeTypes = new Set(["application/pdf"]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },

  filename: function (req, file, cb){
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
    cb(null, filename);
  }
  
})

export const upload = multer ({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },
});
