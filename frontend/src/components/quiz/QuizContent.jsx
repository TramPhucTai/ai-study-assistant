import { useState } from "react";
import { Box, Typography } from "@mui/material";
import QuizQuestionArea from "./QuizQuestionArea.jsx";
import QuizQuestionList from "./QuizQuestionList.jsx";



function QuizContent({
  questions = [],
  difficulty,
  onFinish,
}) {
  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const [
    selectedAnswers,
    setSelectedAnswers,
  ] = useState({});

  const [
    isFinished,
    setIsFinished,
  ] = useState(false);



  if (
    !questions ||
    questions.length === 0
  ) {
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



  const currentQuestion =
    questions[currentQuestionIndex];

  const totalQuestions =
    questions.length;

  const answeredCount =
    Object.keys(
      selectedAnswers
    ).length;



  const correctCount =
    questions.reduce(
      (total, question, index) => {
        if (
          selectedAnswers[index] ===
          question.correctAnswer
        ) {
          return total + 1;
        }

        return total;
      },
      0
    );



  const handleSelectAnswer = (
    answerIndex
  ) => {
    if (isFinished) return;

    setSelectedAnswers(
      (previous) => ({
        ...previous,

        [currentQuestionIndex]:
          answerIndex,
      })
    );
  };



  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (previous) =>
          previous - 1
      );
    }
  };



  const handleNextQuestion = () => {
    if (
      currentQuestionIndex <
      totalQuestions - 1
    ) {
      setCurrentQuestionIndex(
        (previous) =>
          previous + 1
      );
    }
  };



  const handleQuestionNavigation = (
    questionIndex
  ) => {
    setCurrentQuestionIndex(
      questionIndex
    );
  };



  const handleFinishQuiz = () => {
    setIsFinished(true);

    if (onFinish) {
      onFinish(selectedAnswers);
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
          {isFinished
            ? "Kết quả Quiz"
            : "Quiz"}
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



      {/* Result summary */}
      {isFinished && (
        <Box
          sx={{
            mb: 2.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "17px",
              color: "#94a3b8",
            }}
          >
            Bạn trả lời đúng{" "}
            <Box
              component="span"
              sx={{
                color: "#22c55e",
                fontWeight: 700,
              }}
            >
              {correctCount}
            </Box>
            {" / "}
            {totalQuestions} câu
          </Typography>
        </Box>
      )}



      {/* Question header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          maxWidth: "760px",
          mb: 2,
        }}
      >
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
            Câu{" "}
            {currentQuestionIndex + 1}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: 500,
            color: "white",
          }}
        >
          Câu{" "}
          {currentQuestionIndex + 1}
          {" / "}
          {totalQuestions}
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
        <QuizQuestionArea
          currentQuestion={
            currentQuestion
          }
          currentQuestionIndex={
            currentQuestionIndex
          }
          totalQuestions={
            totalQuestions
          }
          selectedAnswer={
            selectedAnswers[
              currentQuestionIndex
            ]
          }
          isFinished={
            isFinished
          }
          onSelectAnswer={
            handleSelectAnswer
          }
          onPreviousQuestion={
            handlePreviousQuestion
          }
          onNextQuestion={
            handleNextQuestion
          }
        />

        <QuizQuestionList
          questions={questions}
          currentQuestionIndex={
            currentQuestionIndex
          }
          selectedAnswers={
            selectedAnswers
          }
          answeredCount={
            answeredCount
          }
          totalQuestions={
            totalQuestions
          }
          isFinished={
            isFinished
          }
          correctCount={
            correctCount
          }
          onQuestionNavigation={
            handleQuestionNavigation
          }
          onFinish={
            handleFinishQuiz
          }
        />
      </Box>
    </Box>
  );
}

export default QuizContent;