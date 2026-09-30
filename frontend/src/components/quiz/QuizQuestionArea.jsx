import { Box, Button, Typography } from "@mui/material";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";



function QuizQuestionArea({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  isFinished,
  onSelectAnswer,
  onPreviousQuestion,
  onNextQuestion,
}) {

  const getAnswerStyle = (
    answerIndex
  ) => {
    const isSelected =
      selectedAnswer ===
      answerIndex;

    const isCorrect =
      currentQuestion.correctAnswer ===
      answerIndex;

    /*
     * Normal answering mode
     */
    if (!isFinished) {
      return {
        border: isSelected
          ? "1px solid #00E5FF"
          : "1px solid #354158",

        bgcolor: isSelected
          ? "#00e5ff11"
          : "#272f42",

        radioBorder: isSelected
          ? "6px solid #00E5FF"
          : "2px solid #8490a5",

        hoverBorder:
          "#00E5FF",

        hoverBackground:
          isSelected
            ? "#00e5ff11"
            : "#272f42",
      };
    }



    /*
     * Finished:
     * always show the correct answer
     */
    if (isCorrect) {
      return {
        border:
          "1px solid #22c55e",

        bgcolor:
          "rgba(34, 197, 94, 0.14)",

        radioBorder:
          "6px solid #22c55e",

        hoverBorder:
          "#22c55e",

        hoverBackground:
          "rgba(34, 197, 94, 0.14)",
      };
    }



    /*
     * Selected but incorrect
     */
    if (
      isSelected &&
      !isCorrect
    ) {
      return {
        border:
          "1px solid #ef4444",

        bgcolor:
          "rgba(239, 68, 68, 0.14)",

        radioBorder:
          "6px solid #ef4444",

        hoverBorder:
          "#ef4444",

        hoverBackground:
          "rgba(239, 68, 68, 0.14)",
      };
    }



    /*
     * Other answers
     */
    return {
      border:
        "1px solid #354158",

      bgcolor:
        "#272f42",

      radioBorder:
        "2px solid #8490a5",

      hoverBorder:
        "#354158",

      hoverBackground:
        "#272f42",
    };
  };



  return (
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
          flexDirection:
            "column",
          gap: 1,
          maxWidth: "760px",
        }}
      >
        {currentQuestion.options.map(
          (
            option,
            answerIndex
          ) => {

            const answerStyle =
              getAnswerStyle(
                answerIndex
              );

            return (
              <Box
                key={answerIndex}

                onClick={() => {
                  if (!isFinished) {
                    onSelectAnswer(
                      answerIndex
                    );
                  }
                }}

                sx={{
                  minHeight: "58px",

                  display: "flex",
                  alignItems: "center",

                  px: 2,
                  py: 0.8,

                  borderRadius:
                    "10px",

                  cursor: isFinished
                    ? "default"
                    : "pointer",

                  border:
                    answerStyle.border,

                  bgcolor:
                    answerStyle.bgcolor,

                  transition:
                    "all 0.2s ease",

                  "&:hover": {
                    borderColor:
                      answerStyle
                        .hoverBorder,

                    bgcolor:
                      answerStyle
                        .hoverBackground,
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
                      answerStyle
                        .radioBorder,

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
          onClick={
            onPreviousQuestion
          }
          disabled={
            currentQuestionIndex ===
            0
          }
          startIcon={
            <FiArrowLeft
              size={21}
            />
          }
          sx={{
            minWidth: "150px",

            px: 2.5,
            py: 0.9,

            bgcolor: "#303b50",
            color: "white",

            textTransform:
              "none",

            fontSize: "16px",
            fontWeight: 600,

            "&:hover": {
              bgcolor:
                "#3c485e",
            },

            "&.Mui-disabled":
              {
                bgcolor:
                  "#252d3d",

                color:
                  "#657085",
              },
          }}
        >
          Câu trước
        </Button>



        <Button
          onClick={
            onNextQuestion
          }
          disabled={
            currentQuestionIndex ===
            totalQuestions - 1
          }
          endIcon={
            <FiArrowRight
              size={21}
            />
          }
          sx={{
            minWidth: "160px",

            px: 2.5,
            py: 1.2,

            bgcolor: "#303b50",
            color: "white",

            textTransform:
              "none",

            fontSize: "16px",
            fontWeight: 600,

            "&:hover": {
              bgcolor:
                "#3c485e",
            },

            "&.Mui-disabled":
              {
                bgcolor:
                  "#252d3d",

                color:
                  "#657085",
              },
          }}
        >
          Câu tiếp theo
        </Button>
      </Box>
    </Box>
  );
}

export default QuizQuestionArea;