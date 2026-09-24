import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth.js";
import { deleteConversation, getUserConversations } from "../helpers/api-communicator.js";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import QuizHeader from "../components/quiz/QuizHeader.jsx";
import QuizContent from "../components/quiz/QuizContent.jsx";



const sampleQuestions = [
  {
    question:
      "Trong mô hình cơ sở dữ liệu quan hệ, khóa chính có chức năng gì?",
    options: [
      "Xác định duy nhất một bản ghi trong bảng",
      "Kết nối Internet với cơ sở dữ liệu",
      "Mã hóa toàn bộ dữ liệu trong bảng",
      "Xóa các bản ghi bị trùng",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "SQL là viết tắt của cụm từ nào?",
    options: [
      "Structured Query Language",
      "Simple Query Logic",
      "System Question Language",
      "Structured Queue Language",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "Khóa ngoại được sử dụng chủ yếu để làm gì?",
    options: [
      "Tạo mật khẩu cho bảng",
      "Thiết lập quan hệ giữa các bảng",
      "Xóa dữ liệu tự động",
      "Sắp xếp dữ liệu",
    ],
    correctAnswer: 1,
  },
  {
    question:
      "Lệnh SQL nào dùng để truy vấn dữ liệu?",
    options: [
      "INSERT",
      "DELETE",
      "SELECT",
      "UPDATE",
    ],
    correctAnswer: 2,
  },
  {
    question:
      "Một hàng trong bảng cơ sở dữ liệu quan hệ còn được gọi là gì?",
    options: [
      "Attribute",
      "Record",
      "Database",
      "Schema",
    ],
    correctAnswer: 1,
  },
];



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

  const quizQuestions =
    sampleQuestions.slice(
      0,
      Number(questionCount)
    );

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
        <QuizContent
          questions={quizQuestions}
          difficulty={difficulty}
          onFinish={(answers) => {
            console.log(
              "Submitted answers:",
              answers
            );
          }}
        />
      </Box>
    </Box>
  );
}

export default Quiz;