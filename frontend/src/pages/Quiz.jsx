import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth.js";
import { deleteConversation, getUserConversations } from "../helpers/api-communicator.js";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import QuizHeader from "../components/quiz/QuizHeader.jsx";



function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useAuth();

  const [conversations, setConversations] = useState([]);

  const {
    conversationId,
    documentId,
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

  const handleBackToChat = () => {
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

        {/* Quiz content */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            px: 5,
            py: 4,
            bgcolor: "#1a1f2e",
            color: "white",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{
              mb: 3,
            }}
          >
            Quiz
          </Typography>

          <Typography
            sx={{
              mb: 1,
            }}
          >
            Số câu hỏi: {questionCount}
          </Typography>

          <Typography>
            Độ khó: {difficulty}
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "#9ca3af",
            }}
          >
            Document ID: {documentId}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Quiz;