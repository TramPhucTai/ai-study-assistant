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

    /*
     * Gemini Files API information.
     *
     * These are temporary because Gemini files
     * expire after approximately 48 hours.
     */
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