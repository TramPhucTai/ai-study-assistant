import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth.js";
import { deleteConversation, getUserConversations } from "../helpers/api-communicator.js";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import QuizHeader from "../components/quiz/QuizHeader.jsx";
import QuizContent from "../components/quiz/QuizContent.jsx";
import { generateQuiz } from "../helpers/api-communicator.js";
import BackToChatDialog from "../components/quiz/BackToChatDialog.jsx";



function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useAuth();

  const [conversations, setConversations] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);

  const [isBackDialogOpen, setIsBackDialogOpen] = useState(false);

  const {
    conversationId,
    questionCount,
    difficulty,
  } = location.state || {};

  const activeConversation = conversations.find((conversation) =>
    conversation._id === conversationId
  );

  // Load conversations for Sidebar
  useEffect(() => {
    if (!auth?.isLoggedIn || !auth?.user) return;

    const loadConversations = async () => {
      try {

        const data = await getUserConversations();

        setConversations(data.conversations);

      } catch (error) {
        console.error(
          "Unable to load conversations:",
          error
        );

        toast.error(
          "Không thể tải danh sách tài liệu"
        );
      }
    };

    loadConversations();

  }, [auth?.isLoggedIn, auth?.user]);

  // Protect the Quiz page
  useEffect(() => {
    if (auth?.isLoading) return;

    if (!auth?.user) {
      navigate("/login");
    }

  }, [auth?.isLoading, auth?.user, navigate]);



  useEffect(() => {
    if (!conversationId || !questionCount || !difficulty) {
      navigate("/chat");
      return;
    }

    const loadQuiz = async () => {
      try {
        setIsLoadingQuiz(true);

        const data = await generateQuiz({
          conversationId,
          questionCount,
          difficulty,
        });

        setQuestions(data.questions);

      } catch (error) {

        console.error(
          "Unable to generate quiz:",
          error
        );

        toast.error(
          "Không thể tạo quiz."
        );

        navigate("/chat");

      } finally {
        setIsLoadingQuiz(false);
      }
    };

    loadQuiz();

  }, [conversationId, questionCount, difficulty, navigate]);



  const handleBackToChat = () => {
    setIsBackDialogOpen(true);
  };

  const handleCancelBackToChat = () => {
    setIsBackDialogOpen(false);
  };

  const handleConfirmBackToChat = () => {
    setIsBackDialogOpen(false);

    navigate("/chat", {
      state: {
        conversationId,
      },
    });
  };

  const handleSelectConversation = (
    selectedConversationId
  ) => {
    navigate("/chat", {
      state: {
        conversationId:
          selectedConversationId,
      },
    });
  };

  const handleNewConversation = () => {
    navigate("/chat", {
      state: {
        newDocument: true,
      },
    });
  };

  const handleDeleteConversation = async (
    conversationIdToDelete
  ) => {
    try {
      await deleteConversation(
        conversationIdToDelete
      );

      setConversations(
        (previous) =>
          previous.filter(
            (conversation) =>
              conversation._id !==
              conversationIdToDelete
          )
      );

      /*
       * If the conversation used by
       * the current Quiz is deleted,
       * return to Chat.
       */
      if (
        conversationIdToDelete ===
        conversationId
      ) {
        navigate("/chat");
      }

    } catch (error) {
      console.error(error);

      toast.error(
        "Không thể xóa cuộc trò chuyện"
      );
    }
  };



  const handleLogout = async () => {
    try {
      await auth.logout();

      navigate("/");

      toast.success(
        "Đăng xuất thành công"
      );

    } catch (error) {
      console.error(error);

      toast.error(
        "Không thể đăng xuất"
      );
    }
  };


  if (!conversationId || !questionCount || !difficulty) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#1a1f2e",
          color: "white",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          gap: 2,
        }}
      >
        <Typography>
          Không tìm thấy dữ liệu Quiz.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/chat")}
        >
          Quay lại Chat
        </Button>
      </Box>
    );
  }



  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#1a1f2e",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={conversationId}
        isGenerating={false}
        user={auth?.user}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onLogout={handleLogout}
      />

      {/* Main Quiz area */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <QuizHeader
          conversation={activeConversation}
          onBackToChat={handleBackToChat}
        />

        {isLoadingQuiz ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: "20px",
              }}
            >
              Đang tạo câu hỏi từ tài liệu...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Quiz content */}
            <QuizContent
              questions={questions}
              difficulty={difficulty}
            />
          </>
        )}

        <BackToChatDialog
          open={isBackDialogOpen}
          onClose={handleCancelBackToChat}
          onConfirm={handleConfirmBackToChat}
        />
      </Box>
    </Box>
  );
}

export default Quiz;