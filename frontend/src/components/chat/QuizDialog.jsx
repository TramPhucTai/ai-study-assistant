import { useState } from "react";
import { Box, Button, Dialog, MenuItem, Select, Typography } from "@mui/material";



function QuizDialog({ open, onClose, onCreateQuiz }) {
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("Trung bình");

  const handleCreateQuiz = () => {
    onCreateQuiz({ questionCount, difficulty, });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "440px",
            maxWidth: "90vw",
            borderRadius: "8px",
            bgcolor: "#2e2e51",
            m: 2,
          },
        },
        backdrop: {
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.65)",
          },
        },
      }}
    >
      <Box
        sx={{
          px: 4,
          pt: 3.5,
          pb: 3,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "25px",
            fontWeight: 600,
            color: "white",
            mb: 4,
          }}
        >
          Tạo Quiz
        </Typography>


        {/* Options */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
            mb: 7,
          }}
        >
          {/* Number of questions */}
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                color: "white",
                mb: 1.5,
              }}
            >
              Số câu hỏi
            </Typography>

            <Select
              fullWidth
              value={questionCount}
              onChange={(event) =>
                setQuestionCount(event.target.value)
              }
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      bgcolor: "#3a3a63",
                      color: "white",
                      mt: 0.5,

                      "& .MuiMenuItem-root": {
                        color: "white",
                        fontSize: "18px",
                        bgcolor: "#3a3a63",
                      },

                      "& .MuiMenuItem-root:hover": {
                        bgcolor: "#51538f",
                      },

                      "& .MuiMenuItem-root.Mui-selected": {
                        bgcolor: "#51538f",
                        color: "white",
                      },

                      "& .MuiMenuItem-root.Mui-selected:hover": {
                        bgcolor: "#6265a8",
                      },
                    },
                  },
                },
              }}
              sx={{
                height: "56px",
                bgcolor: "#51538f",
                color: "white",
                borderRadius: "10px",
                fontSize: "18px",

                "& .MuiSelect-select": {
                  color: "white",
                },

                "& .MuiSelect-icon": {
                  color: "white",
                },

                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "2px solid #00E5FF",
                },
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </Box>


          {/* Difficulty */}
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                color: "white",
                mb: 1.5,
              }}
            >
              Độ khó
            </Typography>

            <Select
              fullWidth
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value)
              }
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      bgcolor: "#3a3a63",
                      color: "white",
                      mt: 0.5,

                      "& .MuiMenuItem-root": {
                        color: "white",
                        fontSize: "18px",
                        bgcolor: "#3a3a63",
                      },

                      "& .MuiMenuItem-root:hover": {
                        bgcolor: "#51538f",
                      },

                      "& .MuiMenuItem-root.Mui-selected": {
                        bgcolor: "#51538f",
                        color: "white",
                      },

                      "& .MuiMenuItem-root.Mui-selected:hover": {
                        bgcolor: "#6265a8",
                      },
                    },
                  },
                },
              }}
              sx={{
                height: "56px",
                bgcolor: "#51538f",
                color: "white",
                borderRadius: "10px",
                fontSize: "18px",

                "& .MuiSelect-select": {
                  color: "white",
                },

                "& .MuiSelect-icon": {
                  color: "white",
                },

                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "2px solid #00E5FF",
                },
              }}
            >
              <MenuItem value="Dễ">Dễ</MenuItem>
              <MenuItem value="Trung bình">Trung bình</MenuItem>
              <MenuItem value="Khó">Khó</MenuItem>
            </Select>
          </Box>
        </Box>


        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <Button
            fullWidth
            onClick={onClose}
            sx={{
              height: "56px",
              bgcolor: "#51538f",
              color: "white",
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "18px",
              fontWeight: 500,

              "&:hover": {
                bgcolor: "#111b27",
              },
            }}
          >
            Hủy
          </Button>

          <Button
            fullWidth
            onClick={handleCreateQuiz}
            sx={{
              height: "56px",
              bgcolor: "#00E5FF",
              color: "#000000",
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "18px",
              fontWeight: 600,

              "&:hover": {
                bgcolor: "white",
              },
            }}
          >
            Tạo Quiz
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default QuizDialog;