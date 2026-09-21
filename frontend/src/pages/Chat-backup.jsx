import { Box } from '@mui/material';
import { useAuth } from '../context/useAuth.js';
import { useEffect, useState } from 'react';
import { deleteConversation, getUserConversations } from '../helpers/api-communicator.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import Sidebar from '../components/sidebar/Sidebar.jsx';
import ChatMessagesContainer from '../components/chat/ChatMessagesContainer.jsx';
import FileUpload from '../components/file/FileUpload.jsx';
import DocumentHeader from '../components/chat/DocumentHeader.jsx';




function Chat() {
  const navigate = useNavigate();

  const auth = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
    if (isGenerating) {
      return;
    }

    /*
     * We no longer load messages here.
     *
     * ChatMessagesContainer watches activeConversationId
     * and loads the messages itself.
     */
    setActiveConversationId(conversationId);
  };



  const handleNewConversation = () => {
    if (isGenerating) {
      return;
    }

    /*
     * No conversation is created yet.
     *
     * This represents the "New document" screen.
     * Later, after the PDF is uploaded,
     * we can create the conversation.
     */
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

  // These will be implemented later
  const handleSummarize = () => {
    console.log(
      "Summarize:",
      activeConversationId
    );
  };


  const handleCreateQuiz = () => {
    console.log(
      "Create quiz:",
      activeConversationId
    );
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
                key={
                  activeConversationId
                }
                activeConversationId={
                  activeConversationId
                }
                onGeneratingChange={
                  setIsGenerating
                }
                onConversationUpdated={
                  handleConversationUpdated
                }
              />
            </Box>
          </>
        ) : (
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
          />
        )}
      </Box>
    </Box>
  );
}

export default Chat;