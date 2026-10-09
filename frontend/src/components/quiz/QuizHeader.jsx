import { Box, Button, Typography } from "@mui/material";
import { FiFileText, FiArrowLeft } from "react-icons/fi";



function QuizHeader({ conversation, onBackToChat }) {
  return (
    <Box
      sx={{
        height: {
          xs: "64px",
          sm: "72px",
        },

        flexShrink: 0,
        display: "flex",
        alignItems: "center",

        px: {
          xs: 1.5,
          sm: 3,
        },

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

          // Leave room for hamburger on mobile
          ml: {
            xs: 6.5,
            md: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexShrink: 0,

            fontSize: {
              xs: "20px",
              sm: "24px",
            },
          }}
        >
          <FiFileText color="white" />
        </Box>

        <Typography
          noWrap
          sx={{
            ml: {
              xs: 1,
              sm: 2,
            },

            minWidth: 0,
            color: "white",

            fontSize: {
              xs: "14px",
              sm: "18px",
            },

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
        startIcon={<FiArrowLeft />}
        sx={{
          height: {
            xs: "40px",
            sm: "48px",
          },

          px: {
            xs: 1.25,
            sm: 2.5,
          },

          ml: {
            xs: 1,
            sm: 2,
          },

          flexShrink: 0,
          minWidth: 0,

          bgcolor: "#00E5FF",
          color: "black",

          borderRadius: "7px",
          textTransform: "none",

          fontSize: {
            xs: "14px",
            sm: "16px",
          },

          fontWeight: 600,

          "& .MuiButton-startIcon": {
            mr: {
              xs: 0.5,
              sm: 1,
            },

            "& svg": {
              fontSize: {
                xs: "18px",
                sm: "21px",
              },
            },
          },

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