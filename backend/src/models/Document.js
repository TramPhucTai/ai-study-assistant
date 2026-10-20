import mongoose from "mongoose";



const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    fileName: {
      type: String,
      required: true
    },

    s3Key: {
      type: String,
      required: true
    },

    mimeType: {
      type: String,
      default: "application/pdf"
    },

    // Xóa sau 48 giờ
    geminiFileName: {
      type: String,
      default: null
    },

    geminiFileUri: {
      type: String,
      default: null
    },

    geminiExpirationTime: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


export default mongoose.model(
  "Document",
  documentSchema
);