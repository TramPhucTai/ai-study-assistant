import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import multer from 'multer';
import { uploadDocument, getDocumentById } from "../controllers/document-controllers.js";



const documentRoutes = Router();

// Cấu hình nhận tệp tải lên và giới hạn dung lượng tối đa 10 MB
const upload = multer({
  // Lưu tệp tạm trong bộ nhớ để phục vụ quá trình xử lý
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  // Chỉ chấp nhận tệp có định dạng PDF
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// API tải tài liệu lên, yêu cầu xác thực người dùng trước khi xử lý tệp
documentRoutes.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  uploadDocument
);

// API lấy thông tin tài liệu theo mã định danh, yêu cầu xác thực người dùng
documentRoutes.get(
  "/:id",
  verifyToken,
  getDocumentById
);

export default documentRoutes;