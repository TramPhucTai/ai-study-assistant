import { Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { createConversation, deleteConversation, getUserConversations } from '../helpers/api-communicator.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import Sidebar from '../components/sidebar/Sidebar.jsx';
import ChatMessagesContainer from '../components/chat/ChatMessagesContainer.jsx';



function Chat() {
  const navigate = useNavigate();

  const auth = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);



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

        let loadedConversations = data.conversations;

        /*
         * First-time user:
         * automatically create one conversation.
         */
        if (loadedConversations.length === 0) {
          const created = await createConversation();

          loadedConversations = [
            created.conversation
          ];
        }

        setConversations(
          loadedConversations
        );

        setActiveConversationId(
          loadedConversations[0]._id
        );

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


  const handleNewConversation = async () => {
    if (isGenerating) {
      return;
    }

    try {
      const data = await createConversation();

      const newConversation = data.conversation;

      setConversations(
        (previous) => [
          newConversation,
          ...previous
        ]
      );

      /*
       * Changing this ID causes
       * ChatMessagesContainer to load the new conversation.
       */
      setActiveConversationId(
        newConversation._id
      );

    } catch (error) {
      console.error(error);

      toast.error(
        "Không thể tạo cuộc trò chuyện"
      );
    }
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
       * Create one empty conversation.
       */
      const created = await createConversation();

      setConversations([
        created.conversation
      ]);

      setActiveConversationId(
        created.conversation._id
      );

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

      navigate("/login");

      toast.success("Đăng xuất thành công");

    } catch (error) {
      console.error(error);

      toast.error("Không thể đăng xuất");
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


  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "calc(100vh - 67px)",
        minWidth: 0,
        overflow: "hidden",
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

      {/* Chat messages container */}
      <ChatMessagesContainer
        key={activeConversationId}
        activeConversationId={activeConversationId}
        onGeneratingChange={setIsGenerating}
        onConversationUpdated={handleConversationUpdated}
      />
    </Box>
  );
}

export default Chat;