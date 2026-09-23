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

  /*
   * Find the currently selected conversation.
   * We can use this to display information such as
   * the PDF filename in the document header.
   */
  const activeConversation = conversations.find((conversation) =>
    conversation._id === activeConversationId
  );

  

  useEffect(() => {
    if (!auth?.isLoggedIn || !auth?.user) return;

    const loadConversations = async () => {
      try {
        toast.loading(
          "Loading chats",
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
          "Successfully loaded chats",
          {
            id: "loadchats"
          }
        );

      } catch (error) {
        console.error(error);

        toast.error(
          "Loading failed",
          {
            id: "loadchats"
          }
        );
      }
    };

    loadConversations();

  }, [auth?.isLoggedIn, auth?.user]);


  // Protected route
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

    /*
     * We no longer load messages here.
     *
     * ChatMessagesContainer watches activeConversationId
     * and loads the messages itself.
     */
    setQuickAction(null);
    setActiveConversationId(conversationId);
  };



  const handleNewConversation = () => {
    if (isGenerating) return;

    /*
     * No conversation is created yet.
     *
     * This represents the "New document" screen.
     * Later, after the PDF is uploaded,
     * we can create the conversation.
     */
    setQuickAction(null);
    setActiveConversationId(null);
  };

  const handleUploadSuccess = (data) => {
    const newConversation = data.conversation;

    if (!newConversation) {
      console.error("Upload succeeded but no conversation was returned");
      return;
    }

    // Add the newly created conversation to the sidebar
    setConversations((previous) => [
      newConversation,
      ...previous,
    ]);

    // Open the new conversation immediately
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

      /*
       * Deleted conversation is not active.
       */
      if (
        conversationIdToDelete !== activeConversationId
      ) {
        setConversations(remaining);
        return;
      }

      /*
       * Active conversation was deleted.
       * Select another existing conversation.
       */
      if (remaining.length > 0) {
        setConversations(remaining);

        setActiveConversationId(
          remaining[0]._id
        );

        return;
      }

      /*
       * No conversations remain.
       */
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


  /*
   * Called by ChatMessagesContainer after sending
   * the first message because the backend may have
   * automatically changed the conversation title.
   */
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
      {/* Sidebar */}
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
        {/* Main content */}
        {activeConversationId ? (
          <>
            <DocumentHeader
              conversation={activeConversation}
              isGenerating={isGenerating}
              onSummarize={handleSummarize}
              onCreateQuiz={handleCreateQuiz}
            />

            {/* Chat */}
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

      {/* Create Quiz popup */}
      <QuizDialog
        open={isQuizDialogOpen}
        onClose={() => setIsQuizDialogOpen(false)}
        onCreateQuiz={handleConfirmCreateQuiz}
      />
    </Box>
  );
}

export default Chat;