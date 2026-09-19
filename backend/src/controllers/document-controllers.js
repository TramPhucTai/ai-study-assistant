import Document from "../models/Document.js";
import Conversation from "../models/Conversation.js";
import { uploadToS3 } from "../lib/s3.js";
import { attachPdfToGemini } from "../lib/gemini-file-service.js";



export const uploadDocument = async (req, res) => {
  try {

    const userId =
      res.locals.jwtData.id;

    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required"
      });
    }

    // 1. Upload permanently to S3
    const uploaded = await uploadToS3(req.file);

    // 2. Create MongoDB Document
    let document = await Document.create({
      userId,
      fileName: uploaded.file_name,
      s3Key: uploaded.file_key,
      mimeType: req.file.mimetype
    });

    // 3. Upload temporary copy to Gemini
    document = await attachPdfToGemini(document);

    // 4. Create conversation for this PDF
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