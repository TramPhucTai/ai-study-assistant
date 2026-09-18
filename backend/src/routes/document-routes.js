import { Router } from "express";
import multer from 'multer';
import { uploadToS3 } from "../lib/s3.js";



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
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const result = await uploadToS3(req.file);

      return res.status(201).json({
        message: "File uploaded successfully",
        document: result,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to upload file",
      });
    }
  }
);

export default documentRoutes;