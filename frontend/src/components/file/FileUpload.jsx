import { Box, Typography } from "@mui/material";
import { FiUpload } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { uploadDocument } from "../../helpers/api-communicator.js";
import loadingSpinner from "../../assets/loading-spinner.gif";



function FileUpload({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);


  const handleUpload = async (file) => {
    try {
      setIsUploading(true);

      const data = await uploadDocument(file);

      console.log("Upload document:", data);

      onUploadSuccess(data);

    } catch (error) {
      console.error("Upload failed:", error);

      toast.error(
        error.response?.data?.message ||
        "Không thể tải tài liệu lên"
      );

      setIsUploading(false);
    }
  };


  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    // Make sure that users can only upload PDF files
    accept: {
      "application/pdf": [".pdf"],
    },

    // Can only upload one file at a time
    multiple: false,

    // Disable dropzone while backend is processing
    disabled: isUploading,

    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (isUploading) return;

      if (rejectedFiles.length > 0) {
        toast.error("Vui lòng chọn tệp PDF");
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Reject file larger than 10 MB
        if (file.size > 10 * 1024 * 1024) {
          toast.error(
            "Vui lòng tải tệp PDF nhỏ hơn 10 MB"
          );

          return;
        }

        await handleUpload(file);
      }
    },
  });



  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 0,
        minHeight: 0,
        bgcolor: "#1a1f2e",
      }}
    >
      <Typography
        sx={{
          fontSize: {
            xs: "28px",
            md: "32px",
          },
          fontWeight: 700,
          lineHeight: 1.1,
          color: "white",
          mb: 6,
        }}
      >
        Luminous

        <Box
          component="span"
          sx={{
            color: "#00E5FF",
          }}
        >
          PDF
        </Box>
      </Typography>


      {isUploading ? (
        // Loading screen
        <Box
          sx={{
            width: {
              xs: "90%",
              sm: "100%",
            },
            maxWidth: "520px",
            minHeight: {
              xs: "200px",
              sm: "180px",
            },

            border: "2px dashed #9ca3af",
            borderRadius: 3,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",

            px: 3,
          }}
        >
          <Box
            component="img"
            src={loadingSpinner}
            alt="Loading"
            sx={{
              width: "72px",
              height: "72px",
              objectFit: "contain",
            }}
          />

          <Typography
            sx={{
              color: "white",
              fontSize: "20px",
              fontWeight: 600,
              mt: 3,
            }}
          >
            Vui lòng chờ...
          </Typography>

          <Typography
            sx={{
              color: "#9ca3af",
              fontSize: "16px",
              mt: 1,
              textAlign: "center",
            }}
          >
            Tài liệu đang được tải lên và xử lý
          </Typography>
        </Box>
      ) : (
        // Upload dropzone
        <Box
          {...getRootProps()}
          sx={{
            width: {
              xs: "90%",
              sm: "100%",
            },
            maxWidth: "520px",
            minHeight: {
              xs: "200px",
              sm: "180px",
            },

            border: "2px dashed",

            borderColor: isDragReject
              ? "#ef4444"
              : "#9ca3af",

            borderRadius: 3,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",

            bgcolor:
              isDragActive && !isDragReject
                ? "#51538f"
                : "transparent",

            cursor: "pointer",

            transition: "0.2s",

            "&:hover": {
              bgcolor: isDragReject
                ? "transparent"
                : "#51538f",
            },
          }}
        >
          <input {...getInputProps()} />

          <FiUpload
            size={32}
            color="#d1d5db"
          />

          {/* Mobile */}
          <Typography
            sx={{
              display: { xs: "block", sm: "none" },
              color: "white",
              fontSize: "18px",
              mt: 2,
              textAlign: "center",
            }}
          >
            Nhấn để chọn tệp PDF
          </Typography>

          {/* Tablet/Desktop */}
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              color: "white",
              fontSize: "20px",
              mt: 2,
            }}
          >
            {isDragActive
              ? "Thả tệp PDF vào đây"
              : "Kéo và thả tệp PDF vào đây để bắt đầu"}
          </Typography>

          {/* Mobile */}
          <Typography
            sx={{
              display: { xs: "block", sm: "none" },
              color: "#9ca3af",
              fontSize: {
                xs: "15px",
                sm: "16px",
              },
              mt: 1,
              textAlign: "center",
            }}
          >
            Tệp PDF tối đa 10 MB
          </Typography>

          {/* Tablet/Desktop */}
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              color: "#9ca3af",
              fontSize: {
                xs: "15px",
                sm: "16px",
              },
              mt: 1,
              textAlign: "center",
            }}
          >
            hoặc nhấn để chọn tệp
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default FileUpload;