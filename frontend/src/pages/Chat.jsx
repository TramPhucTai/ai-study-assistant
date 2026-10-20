import { Box } from '@mui/material';
import { useAuth } from '../context/useAuth.js';
import { useEffect, useState, useCallback } from 'react';
import { deleteConversation, getUserConversations, getDocument } from '../helpers/api-communicator.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import Sidebar from '../components/sidebar/Sidebar.jsx';
import ChatMessagesContainer from '../components/chat/ChatMessagesContainer.jsx';
import FileUpload from '../components/file/FileUpload.jsx';
import DocumentHeader from '../components/chat/DocumentHeader.jsx';
import QuizDialog from '../components/chat/QuizDialog.jsx';




function Chat() {
  const navigate = useNavigate();

  const auth = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quickAction, setQuickAction] = useState(null);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);

  // Xác định hội thoại đang được chọn để hiển thị các thông tin liên quan, chẳng hạn tên tệp PDF trên thanh tiêu đề tài liệu
  const activeConversation = conversations.find((conversation) =>
    conversation._id === activeConversationId
  );

  

  useEffect(() => {
    if (!auth?.isLoggedIn || !auth?.user) return;

    const loadConversations = async () => {
      try {
        toast.loading(
          "Đang tải các cuộc trò chuyện...",
          {
            id: "loadchats"
          }
        );

        const data = await getUserConversations();

        const loadedConversations = data.conversations;

        setConversations(loadedConversations);

        if (loadedConversations.length > 0) {
          setActiveConversationId(loadedConversations[0]._id);
        } else {
          setActiveConversationId(null);
        }

        toast.success(
          "Tải các cuộc trò chuyện thành công",
          {
            id: "loadchats"
          }
        );

      } catch (error) {
        console.error(error);

        toast.error(
          "Không thể tải các cuộc trò chuyện",
          {
            id: "loadchats"
          }
        );
      }
    };

    loadConversations();

  }, [auth?.isLoggedIn, auth?.user]);


  // Bảo vệ trang Chat, chuyển người dùng chưa đăng nhập đến trang đăng nhập
  useEffect(() => {
    if (auth?.isLoading) {
      return;
    }

    if (!auth?.user) {
      navigate("/login");
    }

  }, [auth?.isLoading, auth?.user, navigate]);


  const handleSelectConversation = (conversationId) => {
    if (isGenerating) return;

    // Chỉ cập nhật mã hội thoại đang chọn. ChatMessagesContainer sẽ tự tải tin nhắn khi activeConversationId thay đổi
    setQuickAction(null);
    setActiveConversationId(conversationId);
  };



  const handleNewConversation = () => {
    if (isGenerating) return;

    // Chưa tạo hội thoại mới tại thời điểm này. Hệ thống hiển thị giao diện tải tài liệu và chỉ tạo hội thoại sau khi người dùng tải PDF lên
    setQuickAction(null);
    setActiveConversationId(null);
  };

  const handleUploadSuccess = (data) => {
    const newConversation = data.conversation;

    if (!newConversation) {
      console.error("Upload succeeded but no conversation was returned");
      return;
    }

    // Thêm hội thoại vừa tạo vào danh sách trên thanh bên
    setConversations((previous) => [
      newConversation,
      ...previous,
    ]);

    // Chuyển ngay đến hội thoại gắn với tài liệu vừa tải lên
    setActiveConversationId(newConversation._id);
  };



  const handleDeleteConversation = async (conversationIdToDelete) => {
    if (!conversationIdToDelete || isGenerating) {
      return;
    }

    try {
      await deleteConversation(
        conversationIdToDelete
      );

      const remaining = conversations.filter(
        (conversation) =>
          conversation._id !== conversationIdToDelete
      );

      // Nếu hội thoại bị xóa không phải hội thoại đang mở, chỉ cần cập nhật lại danh sách hội thoại
      if (
        conversationIdToDelete !== activeConversationId
      ) {
        setConversations(remaining);
        return;
      }

      // Nếu hội thoại đang mở bị xóa, chuyển sang hội thoại khác còn lại trong danh sách
      if (remaining.length > 0) {
        setConversations(remaining);

        setActiveConversationId(
          remaining[0]._id
        );

        return;
      }

      // Nếu không còn hội thoại nào, quay về giao diện tải tài liệu
      setConversations([]);
      setActiveConversationId(null);

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


  // Tải lại danh sách hội thoại sau khi gửi tin nhắn, vì tiêu đề hội thoại có thể được backend cập nhật tự động dựa trên nội dung trao đổi.
  const handleConversationUpdated = async () => {
    try {
      const data = await getUserConversations();

      setConversations(
        data.conversations
      );

    } catch (error) {
      console.error(
        "Unable to refresh conversations:",
        error
      );
    }
  };



  const handleSummarize = () => {
    if (!activeConversationId || isGenerating) return;

    setQuickAction({
      id: Date.now(),
      prompt:
        "Hãy tóm tắt toàn bộ tài liệu này. Trình bày các nội dung chính một cách rõ ràng, có cấu trúc, dễ hiểu và làm nổi bật những kiến thức quan trọng mà sinh viên cần ghi nhớ.",
    });
  };

  const handleQuickActionHandled = useCallback(() => {
    setQuickAction(null);
  }, []);


  const handleCreateQuiz = () => {
    if (!activeConversationId || isGenerating) return;

    setIsQuizDialogOpen(true);
  };

  const handleConfirmCreateQuiz = async ({ questionCount, difficulty, }) => {
    if (!activeConversation) return;

    try {

      const data = await getDocument(
        activeConversation.documentId
      );

      setIsQuizDialogOpen(false);

      // Truyền thông tin hội thoại, tài liệu và cấu hình Quiz sang trang làm bài
      navigate("/quiz", {
        state: {
          conversationId: activeConversation._id,
          documentId: activeConversation.documentId,
          fileName: data.document.fileName,
          questionCount,
          difficulty,
          conversations,
        },
      });

    } catch (error) {

      console.error(
        "Unable to load document:",
        error
      );

      toast.error(
        "Không thể tải thông tin tài liệu"
      );

    }
  };



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
      {/* Thanh bên */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isGenerating={isGenerating}
        user={auth?.user}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onLogout={handleLogout}
      />

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
        {/* Vùng chính */}
        {activeConversationId ? (
          <>
            <DocumentHeader
              conversation={activeConversation}
              isGenerating={isGenerating}
              onSummarize={handleSummarize}
              onCreateQuiz={handleCreateQuiz}
            />

            {/* Khu vực hiển thị nội dung trao đổi với AI */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,

                display: "flex",
                overflow: "hidden",
              }}
            >
              <ChatMessagesContainer
                key={activeConversationId}
                activeConversationId={activeConversationId}
                onGeneratingChange={setIsGenerating}
                onConversationUpdated={handleConversationUpdated}
                quickAction={quickAction}
                onQuickActionHandled={handleQuickActionHandled}
              />
            </Box>
          </>
        ) : (
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
          />
        )}
      </Box>

      {/* Hộp thoại thiết lập số lượng và độ khó câu hỏi Quiz */}
      <QuizDialog
        open={isQuizDialogOpen}
        onClose={() => setIsQuizDialogOpen(false)}
        onCreateQuiz={handleConfirmCreateQuiz}
      />
    </Box>
  );
}

export default Chat;