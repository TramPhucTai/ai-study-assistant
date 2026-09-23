import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import multer from 'multer';
import { uploadDocument } from "../controllers/document-controllers.js";



const documentRoutes = Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

documentRoutes.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  uploadDocument
);

export default documentRoutes;