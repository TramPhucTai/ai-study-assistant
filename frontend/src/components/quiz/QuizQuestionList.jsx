import {
  Box,
  Button,
  Typography,
} from "@mui/material";



function QuizQuestionList({
  questions,
  currentQuestionIndex,
  selectedAnswers,
  answeredCount,
  totalQuestions,
  isFinished,
  correctCount,
  onQuestionNavigation,
  onFinish,
}) {

  const getQuestionStatus = (
    questionIndex
  ) => {

    /*
     * Result mode
     */
    if (isFinished) {
      const selectedAnswer =
        selectedAnswers[
          questionIndex
        ];

      const correctAnswer =
        questions[
          questionIndex
        ].correctAnswer;



      if (
        selectedAnswer ===
        correctAnswer
      ) {
        return "correct";
      }

      return "wrong";
    }



    /*
     * Normal quiz mode
     */
    if (
      questionIndex ===
      currentQuestionIndex
    ) {
      return "current";
    }

    if (
      selectedAnswers[
        questionIndex
      ] !== undefined
    ) {
      return "answered";
    }

    return "unanswered";
  };



  const getQuestionButtonStyle = (
    status,
    questionIndex
  ) => {

    const isCurrent =
      questionIndex ===
      currentQuestionIndex;



    if (isFinished) {
      if (status === "correct") {
        return {
          bgcolor: "#22c55e",

          color: "white",

          border: isCurrent
            ? "2px solid #00E5FF"
            : "1px solid #16a34a",

          "&:hover": {
            bgcolor: "#16a34a",
          },
        };
      }



      if (status === "wrong") {
        return {
          bgcolor: "#ef4444",

          color: "white",

          border: isCurrent
            ? "2px solid #00E5FF"
            : "1px solid #dc2626",

          "&:hover": {
            bgcolor: "#dc2626",
          },
        };
      }
    }



    switch (status) {

      case "current":
        return {
          bgcolor:
            "#00E5FF",

          color: "black",

          border:
            "1px solid #19d3e6",

          "&:hover": {
            bgcolor:
              "#22d3ee",
          },
        };



      case "answered":
        return {
          bgcolor:
            "#4f5d95",

          color: "white",

          border:
            "1px solid #64748b",

          "&:hover": {
            bgcolor:
              "#5b69a3",
          },
        };



      default:
        return {
          bgcolor:
            "#273247",

          color: "white",

          border:
            "1px solid #475569",

          "&:hover": {
            bgcolor:
              "#334155",
          },
        };
    }
  };



  return (
    <Box
      sx={{
        width: "280px",
        flexShrink: 0,
        mt: -6.5,
        p: 2,

        bgcolor: "#272f42",

        border:
          "1px solid #354158",

        borderRadius:
          "10px",

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
                key={
                  questionIndex
                }

                onClick={() =>
                  onQuestionNavigation(
                    questionIndex
                  )
                }

                sx={{
                  minWidth: 0,
                  width: "100%",

                  aspectRatio:
                    "1 / 1",

                  p: 0,

                  borderRadius:
                    "8px",

                  fontSize:
                    "15px",

                  fontWeight:
                    600,

                  ...getQuestionButtonStyle(
                    status,
                    questionIndex
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

          flexDirection:
            "column",

          gap: 1.7,
          mb: 2.5,
        }}
      >
        {!isFinished ? (
          <>
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
          </>
        ) : (
          <>
            <LegendItem
              color="#22c55e"
              label="Trả lời đúng"
            />

            <LegendItem
              color="#ef4444"
              label="Trả lời sai"
            />
          </>
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



      {!isFinished ? (
        <>
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

          <Button
            fullWidth
            onClick={onFinish}
            sx={{
              py: 1.2,

              bgcolor:
                "#00E5FF",

              color: "black",

              textTransform:
                "none",

              fontWeight: 700,
              fontSize: "16px",

              "&:hover": {
                bgcolor:
                  "white",
              },
            }}
          >
            Hoàn thành
          </Button>
        </>
      ) : (
        <Box>
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: "14px",
              mb: 0.5,
            }}
          >
            Kết quả
          </Typography>

          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#22c55e",
            }}
          >
            {correctCount}/
            {totalQuestions} câu đúng
          </Typography>
        </Box>
      )}
    </Box>
  );
}



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

          borderRadius:
            "50%",

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



export default QuizQuestionList;