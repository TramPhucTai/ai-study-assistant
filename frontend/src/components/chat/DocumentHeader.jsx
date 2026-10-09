import { Box, Button, Typography } from "@mui/material";
import { FiFileText } from "react-icons/fi";
import { MdOutlineSummarize } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";



function DocumentHeader({
  conversation,
  isGenerating,
  onSummarize,
  onCreateQuiz
}) {
  return (
    <Box
      sx={{
        height: {
          xs: "64px",
          sm: "72px"
        },
        flexShrink: 0,
        display: "flex",
        alignItems: "center",

        px: {
          xs: 1.5,
          sm: 3
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
          ml: {
            xs: 6.5,
            sm: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexShrink: 0,
            fontSize: {
              xs: "20px",
              sm: "24px"
            }
          }}
        >
          <FiFileText color="white" />
        </Box>

        <Typography
          noWrap
          sx={{
            ml: {
              xs: 1,
              sm: 2
            },
            color: "white",

            fontSize: {
              xs: "14px",
              sm: "18px"
            },

            fontWeight: 600,
          }}
        >
          {conversation?.title
            ? conversation.title.toLowerCase().endsWith(".pdf")
              ? conversation.title
              : `${conversation.title}.pdf`
            : "Tài liệu.pdf"}
        </Typography>
      </Box>


      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",

          gap: {
            xs: 0.75,
            sm: 1.5
          },

          ml: {
            xs: 1,
            sm: 2
          },

          flexShrink: 0,
        }}
      >
        {/* Summarize */}
        <Button
          onClick={onSummarize}
          disabled={isGenerating}
          startIcon={
            <MdOutlineSummarize />
          }
          sx={{
            height: {
              xs: "40px",
              sm: "48px"
            },

            px: {
              xs: 1.25,
              sm: 2.5
            },

            minWidth: 0,

            bgcolor: "#00E5FF",
            color: "black",
            borderRadius: "7px",
            textTransform: "none",

            fontSize: {
              xs: "14px",
              sm: "16px"
            },

            fontWeight: 600,

            "& .MuiButton-startIcon": {
              mr: {
                xs: 0.5,
                sm: 1
              },

              "& svg": {
                fontSize: {
                  xs: "18px",
                  sm: "20px"
                }
              }
            },

            "&:hover": {
              bgcolor: "white"
            },

            "&.Mui-disabled": {
              bgcolor: "#00e5ff11",
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
          startIcon={<BsQuestionCircle />}
          sx={{
            height: {
              xs: "40px",
              sm: "48px",
            },

            px: {
              xs: 1.25,
              sm: 2.5,
            },

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

            "&.Mui-disabled": {
              bgcolor: "#00e5ff11",
              color: "#888",
            },
          }}
        >
          {/* Mobile */}
          <Box
            component="span"
            sx={{
              display: {
                xs: "inline",
                sm: "none",
              },
            }}
          >
            Quiz
          </Box>

          {/* Desktop */}
          <Box
            component="span"
            sx={{
              display: {
                xs: "none",
                sm: "inline",
              },
            }}
          >
            Tạo Quiz
          </Box>
        </Button>
      </Box>
    </Box>
  );
}

export default DocumentHeader;