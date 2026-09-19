import { Box, Typography } from "@mui/material";
import { FiUpload } from "react-icons/fi";
import { useDropzone } from 'react-dropzone'
import { uploadDocument } from "../../helpers/api-communicator.js";



function FileUpload() {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    // Make sure that users can only upload PDF files
    accept: { "application/pdf": [".pdf"] },

    // Can only upload one file at a time
    multiple: false,

    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) return;

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Reject file size larger than 10 MB
        if (file.size > 10 * 1024 * 1024) {
          alert('Vui lòng tải tệp PDF nhỏ hơn 10 MB');
          return;
        };

        try {

          const data = await uploadDocument(file);

          console.log('Upload document:', data)

        } catch (error) {

          console.log('Upload failed:', error)
          
        }

      }
    }
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
          color: "white",
          fontSize: "32px",
          fontWeight: 500,
          mb: 6,
        }}
      >
        StudyAI
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          width: "100%",
          maxWidth: "520px",
          minHeight: "180px",

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

        <Typography
          sx={{
            color: "white",
            fontSize: "20px",
            mt: 2,
          }}
        >
          {isDragActive
            ? "Thả tệp PDF vào đây"
            : "Kéo và thả tệp PDF vào đây để bắt đầu"}
        </Typography>

        <Typography
          sx={{
            color: "#9ca3af",
            fontSize: "16px",
            mt: 1,
          }}
        >
          hoặc nhấn để chọn tệp
        </Typography>
      </Box>
    </Box>
  );
}

export default FileUpload;