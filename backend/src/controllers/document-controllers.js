import Document from "../models/Document.js";
import Conversation from "../models/Conversation.js";
import { uploadToS3 } from "../services/s3.js";
import { attachPdfToGemini } from "../services/gemini-file-service.js";



export const uploadDocument = async (req, res) => {
  try {

    const userId =
      res.locals.jwtData.id;

    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required"
      });
    }

    // Lưu tệp PDF vào Amazon S3 để lưu trữ lâu dài
    const uploaded = await uploadToS3(req.file);

    // Tạo bản ghi tài liệu trong MongoDB, lưu thông tin người dùng và khóa tệp trên S3
    let document = await Document.create({
      userId,
      fileName: uploaded.file_name,
      s3Key: uploaded.file_key,
      mimeType: req.file.mimetype
    });

    // Tải tài liệu lên Gemini để phục vụ chức năng hỏi đáp bằng AI
    document = await attachPdfToGemini(document);

    // Tạo hội thoại gắn với tài liệu PDF vừa tải lên
    const conversation = await Conversation.create({
      userId,
      documentId: document._id,
      title: document.fileName.replace(/\.pdf$/i, "")
    });

    return res.status(201).json({
      message: "Document uploaded successfully",
      document: {
        _id: document._id,
        fileName: document.fileName
      },

      conversation: {
        _id: conversation._id,
        title: conversation.title,
        documentId: conversation.documentId,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }
    });

  } catch (error) {

    console.error("uploadDocument error:", error);

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to upload document"
    });

  }
};

export const getDocumentById = async (req, res) => {
  try {
    const userId =
      res.locals.jwtData.id;

    const { id } = req.params;

    // Tìm tài liệu theo mã định danh và mã người dùng để giới hạn quyền truy cập
    const document =
      await Document.findOne({
        _id: id,
        userId,
      });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    return res.status(200).json({
      document: {
        _id: document._id,
        fileName: document.fileName,
        mimeType: document.mimeType,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      },
    });

  } catch (error) {
    console.error(
      "getDocumentById error:",
      error
    );

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to get document",
    });
  }
};