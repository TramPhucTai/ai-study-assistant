import { Box, Typography } from "@mui/material";
import { FiUpload } from "react-icons/fi";



function FileUpload() {
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
        sx={{
          width: "100%",
          maxWidth: "520px",
          minHeight: "180px",

          border: "2px dashed #6b7280",
          borderRadius: 3,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          bgcolor: "rgba(255, 255, 255, 0.04)",

          cursor: "pointer",

          transition: "0.2s",

          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.07)",
            borderColor: "#9ca3af",
          },
        }}
      >
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
          Kéo và thả tệp PDF vào đây để bắt đầu
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