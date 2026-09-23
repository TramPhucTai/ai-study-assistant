import { Box, Button, Typography } from "@mui/material";
import { FiFileText, FiArrowLeft } from "react-icons/fi";



function QuizHeader({ conversation, onBackToChat }) {
  return (
    <Box
      sx={{
        height: "72px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        px: 3,
        bgcolor: "#111b27",
        borderBottom: "1px solid #334155",
        boxSizing: "border-box",
      }}
    >
      {/* Document information */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          minWidth: 0,
        }}
      >
        <FiFileText
          size={24}
          color="white"
        />

        <Typography
          noWrap
          sx={{
            ml: 2,
            color: "white",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          {conversation?.title
            ? conversation.title.toLowerCase().endsWith(".pdf")
              ? conversation.title
              : `${conversation.title}.pdf`
            : "Tài liệu.pdf"
          }
        </Typography>
      </Box>

      {/* Back to Chat */}
      <Button
        onClick={onBackToChat}
        startIcon={
          <FiArrowLeft size={21} />
        }
        sx={{
          height: "48px",
          px: 2.5,
          bgcolor: "#00E5FF",
          color: "black",
          borderRadius: "7px",
          textTransform: "none",
          fontSize: "16px",
          fontWeight: 600,
          "&:hover": {
            bgcolor: "white",
          },
        }}
      >
        Quay lại Chat
      </Button>
    </Box>
  );
}

export default QuizHeader;