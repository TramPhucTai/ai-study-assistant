import { Box, IconButton } from "@mui/material";
import { IoMdSend } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { getConversation, streamChatRequest } from "../../helpers/api-communicator.js";
import ChatItem from "./ChatItem";



function ChatMessagesContainer({ activeConversationId, onGeneratingChange, onConversationUpdated }) {
  const inputRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  /*
   * Helper so this component can keep its own
   * state while also telling Chat.jsx that generation
   * is currently happening.
   */
  const updateGeneratingState = (value) => {
    setIsGenerating(value);

    onGeneratingChange?.(value);
  };

  /*
   * Whenever the user selects another conversation,
   * load that conversation's messages here.
   */
  useEffect(() => {
    if (!activeConversationId) {
      return;
    }

    const loadConversation = async () => {
      try {
        const data = await getConversation(
          activeConversationId
        );

        setChatMessages(
          data.conversation.messages
        );

        inputRef.current?.focus();

      } catch (error) {
        console.error(error);

        toast.error(
          "Không thể tải cuộc trò chuyện"
        );
      }
    };

    loadConversation();

  }, [activeConversationId]);


  
  const handleSubmit = async () => {
    if (
      isGenerating ||
      !activeConversationId
    ) {
      return;
    }

    const content =
      inputRef.current?.value.trim();

    if (!content) {
      return;
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    const userMessage = {
      role: "user",
      content
    };

    const assistantPlaceholder = {
      role: "assistant",
      content: ""
    };

    /*
     * Show the user's message immediately,
     * followed by an empty assistant message.
     */
    setChatMessages((previous) => [
      ...previous,
      userMessage,
      assistantPlaceholder
    ]);

    updateGeneratingState(true);

    try {
      await streamChatRequest(
        activeConversationId,
        content,
        (textDelta) => {
          setChatMessages((previous) => {
            const updatedMessages = [
              ...previous
            ];

            const assistantIndex =
              updatedMessages.length - 1;

            updatedMessages[assistantIndex] = {
              ...updatedMessages[assistantIndex],

              content:
                updatedMessages[assistantIndex].content +
                textDelta
            };

            return updatedMessages;
          });
        }
      );

      /*
       * Notify Chat.jsx that something about
       * this conversation may have changed,
       * particularly its automatically generated title.
       */
      await onConversationUpdated?.();

    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
        "Không thể tạo câu trả lời"
      );

      /*
       * Remove the assistant response if
       * generation failed.
       */
      setChatMessages((previous) => {
        const updatedMessages = [
          ...previous
        ];

        if (
          updatedMessages.at(-1)?.role ===
          "assistant"
        ) {
          updatedMessages.pop();
        }

        return updatedMessages;
      });

    } finally {
      updateGeneratingState(false);

      inputRef.current?.focus();
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        bgcolor: "#1a1f2e",
      }}
    >
      {/* Chat messages */}
      <Box
        sx={{
          width: "100%",
          borderRadius: 3,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          overflowY: "auto",
          scrollBehavior: "smooth",
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          px: 2,
          py: 2,
        }}
      >
        {chatMessages.map(
          (chat, index) => (
            <ChatItem
              key={
                chat.id ??
                `${chat.role}-${index}`
              }
              role={chat.role}
              content={
                isGenerating &&
                  index ===
                  chatMessages.length - 1 &&
                  chat.content === ""
                  ? "Thinking..."
                  : chat.content
              }
            />
          )
        )}
      </Box>

      {/* Chat input */}
      <Box
        sx={{
          px: 2,
          pb: 2,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: "100%",
            minHeight: "70px",
            bgcolor: "rgb(17, 27, 39)",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <input
            ref={inputRef}
            disabled={
              isGenerating ||
              !activeConversationId
            }
            type="text"
            placeholder="Hỏi điều gì đó về tài liệu..."
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();

                handleSubmit();
              }
            }}
            style={{
              flex: 1,
              minWidth: 0,
              backgroundColor: "transparent",
              padding: "20px 24px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />

          <IconButton
            onClick={handleSubmit}
            disabled={
              isGenerating ||
              !activeConversationId
            }
            sx={{
              color: "white",
              mr: 1.5,
            }}
          >
            <IoMdSend />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default ChatMessagesContainer;