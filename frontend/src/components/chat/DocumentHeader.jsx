import { Box, Button, Typography } from "@mui/material";
import { FiFileText } from "react-icons/fi";
import { MdOutlineSummarize } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";



function DocumentHeader({ conversation, isGenerating, onSummarize, onCreateQuiz }) {
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


      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          ml: 2,
        }}
      >
        {/* Summarize */}
        <Button
          onClick={onSummarize}
          disabled={isGenerating}
          startIcon={
            <MdOutlineSummarize
              size={20}
            />
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
              bgcolor: "white"
            },

            "&.Mui-disabled": {
              bgcolor: "#00e5ff33",
              color: "#888"
            }
          }}
        >
          Tóm tắt
        </Button>

        {/* Create Quiz */}
        <Button
          onClick={onCreateQuiz}
          disabled={isGenerating}
          startIcon={
            <BsQuestionCircle
              size={21}
            />
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
              bgcolor: "white"
            },

            "&.Mui-disabled": {
              bgcolor: "#00e5ff33",
              color: "#888"
            }
          }}
        >
          Tạo Quiz
        </Button>
      </Box>
    </Box>
  );
}

export default DocumentHeader;