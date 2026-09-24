import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";



function QuizContent({ questions = [], difficulty, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  if (!questions || questions.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
        }}
      >
        <Typography>
          Chưa có câu hỏi Quiz.
        </Typography>
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const totalQuestions = questions.length;

  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectAnswer = (answerIndex) => {
    setSelectedAnswers((previous) => ({
      ...previous,
      [currentQuestionIndex]:
        answerIndex,
    }));
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (previous) => previous - 1
      );
    }
  };


  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(
        (previous) => previous + 1
      );
    }
  };

  const handleQuestionNavigation = (questionIndex) => {
    setCurrentQuestionIndex(
      questionIndex
    );
  };

  const handleFinishQuiz = () => {
    if (onFinish) {
      onFinish(selectedAnswers);
    }
  };

  const getQuestionStatus = (questionIndex) => {
    if (questionIndex === currentQuestionIndex) {
      return "current";
    }

    if (selectedAnswers[questionIndex] !== undefined) {
      return "answered";
    }

    return "unanswered";
  };

  const getQuestionButtonStyle = (status) => {
    switch (status) {
      case "current":
        return {
          bgcolor: "#00E5FF",
          color: "black",
          border: "1px solid #19d3e6",
          "&:hover": {
            bgcolor: "#22d3ee",
          },
        };

      case "answered":
        return {
          bgcolor: "#4f5d95",
          color: "white",
          border: "1px solid #64748b",
          "&:hover": {
            bgcolor: "#5b69a3",
          },
        };

      default:
        return {
          bgcolor: "#273247",
          color: "white",
          border: "1px solid #475569",
          "&:hover": {
            bgcolor: "#334155",
          },
        };
    }
  };



  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        bgcolor: "#1a1f2e",
        color: "white",
        px: {
          xs: 2,
          md: 4,
          lg: 5,
        },
        py: 2.5,
      }}
    >
      {/* Quiz title + difficulty */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "28px",
              md: "34px",
            },
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          Quiz
        </Typography>

        {difficulty && (
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: "15px",
              fontWeight: 400,
              mt: 0.7,
            }}
          >
            Độ khó: {difficulty}
          </Typography>
        )}
      </Box>

      {/* Question header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "760px",
          mb: 2,
        }}
      >
        {/* Question number */}
        <Box
          sx={{
            display: "inline-flex",
            px: 2,
            py: 1,
            borderRadius: "8px",
            bgcolor: "#303b50",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
            }}
          >
            Câu {currentQuestionIndex + 1}
          </Typography>
        </Box>

        {/* Current / total */}
        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: 500,
            color: "white",
          }}
        >
          Câu {currentQuestionIndex + 1} / {totalQuestions}
        </Typography>
      </Box>

      {/* Main Quiz layout */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        {/* =========================
            LEFT - QUESTION AREA
        ========================== */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Question */}
          <Typography
            sx={{
              fontSize: {
                xs: "21px",
                md: "25px",
              },
              fontWeight: 500,
              lineHeight: 1.4,
              mb: 2.5,
            }}
          >
            {currentQuestion.question}
          </Typography>

          {/* Answers */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              maxWidth: "760px",
            }}
          >
            {currentQuestion.options.map(
              (option, answerIndex) => {
                const isSelected =
                  selectedAnswers[
                  currentQuestionIndex
                  ] === answerIndex;

                return (
                  <Box
                    key={answerIndex}
                    onClick={() =>
                      handleSelectAnswer(
                        answerIndex
                      )
                    }
                    sx={{
                      minHeight: "58px",
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 0.8,
                      borderRadius: "10px",
                      cursor: "pointer",
                      border:
                        isSelected
                          ? "1px solid #00E5FF"
                          : "1px solid #354158",
                      bgcolor:
                        isSelected
                          ? "#00e5ff11"
                          : "#272f42",
                      transition:
                        "all 0.2s ease",
                      "&:hover": {
                        borderColor:
                          "#00E5FF",
                        bgcolor:
                          isSelected
                            ? "#00e5ff11"
                            : "#272f42",
                      },
                    }}
                  >
                    {/* Radio circle */}
                    <Box
                      sx={{
                        width: "20px",
                        height: "20px",
                        flexShrink: 0,

                        mr: 2,

                        borderRadius:
                          "50%",

                        border:
                          isSelected
                            ? "6px solid #00E5FF"
                            : "2px solid #8490a5",

                        boxSizing:
                          "border-box",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "17px",
                        lineHeight: 1.5,
                      }}
                    >
                      {option}
                    </Typography>
                  </Box>
                );
              }
            )}
          </Box>


          {/* Previous / Next */}
          <Box
            sx={{
              maxWidth: "760px",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              startIcon={<FiArrowLeft size={21} />}
              sx={{
                minWidth: "150px",
                px: 2.5,
                py: 0.9,
                bgcolor: "#303b50",
                color: "white",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#3c485e",
                },
                "&.Mui-disabled": {
                  bgcolor: "#252d3d",
                  color: "#657085",
                },
              }}
            >
              Câu trước
            </Button>

            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              endIcon={<FiArrowRight size={21} />}
              sx={{
                minWidth: "160px",
                px: 2.5,
                py: 1.2,
                bgcolor: "#303b50",
                color: "white",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#3c485e",
                },
                "&.Mui-disabled": {
                  bgcolor: "#252d3d",
                  color: "#657085",
                },
              }}
            >
              Câu tiếp theo
            </Button>
          </Box>
        </Box>


        {/* =========================
            RIGHT - QUESTION LIST
        ========================== */}
        <Box
          sx={{
            width: "260px",
            flexShrink: 0,
            mt: -6,
            p: 2,
            bgcolor: "#272f42",
            border: "1px solid #354158",
            borderRadius: "10px",
            display: {
              xs: "none",
              lg: "block",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              mb: 2,
            }}
          >
            Danh sách câu hỏi
          </Typography>

          {/* Question number grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(5, 1fr)",
              gap: 1,
              mb: 1.5,
            }}
          >
            {questions.map(
              (_, questionIndex) => {
                const status =
                  getQuestionStatus(
                    questionIndex
                  );

                return (
                  <Button
                    key={questionIndex}
                    onClick={() =>
                      handleQuestionNavigation(
                        questionIndex
                      )
                    }
                    sx={{
                      minWidth: 0,
                      width: "100%",
                      aspectRatio: "1 / 1",
                      p: 0,

                      borderRadius: "8px",
                      fontSize: "15px",
                      fontWeight: 600,
                      ...getQuestionButtonStyle(
                        status
                      ),
                    }}
                  >
                    {questionIndex + 1}
                  </Button>
                );
              }
            )}
          </Box>


          {/* Divider */}
          <Box
            sx={{
              height: "1px",
              bgcolor: "#475569",
              mb: 2.5,
            }}
          />

          {/* Legend */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.7,
              mb: 2.5,
            }}
          >
            <LegendItem
              color="#00E5FF"
              label="Câu hiện tại"
            />

            <LegendItem
              color="#273247"
              label="Chưa trả lời"
            />

            <LegendItem
              color="#4f5d95"
              label="Đã trả lời"
            />
          </Box>


          {/* Divider */}
          <Box
            sx={{
              height: "1px",
              bgcolor: "#475569",
              mb: 2.5,
            }}
          />


          <Typography
            sx={{
              mb: 2,
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Đã trả lời{" "}
            {answeredCount}/
            {totalQuestions} câu
          </Typography>


          {/* Finish */}
          <Button
            fullWidth
            onClick={handleFinishQuiz}
            sx={{
              py: 1.2,
              bgcolor: "#00E5FF",
              color: "black",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "16px",
              "&:hover": {
                bgcolor: "white",
              },
            }}
          >
            Hoàn thành
          </Button>
        </Box>
      </Box>
    </Box>
  );
}



/*
 * Small component used by the
 * question status legend.
 */
function LegendItem({
  color,
  label,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          bgcolor: color,
          border:
            "1px solid #64748b",
        }}
      />

      <Typography
        sx={{
          fontSize: "15px",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}


export default QuizContent;