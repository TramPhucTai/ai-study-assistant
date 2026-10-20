import { Box, IconButton } from "@mui/material";
import { IoMdSend } from "react-icons/io";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { getConversation, streamChatRequest } from "../../helpers/api-communicator.js";
import loadingSpinner from "../../assets/loading-spinner.gif";
import ChatItem from "./ChatItem";



function ChatMessagesContainer({ activeConversationId, onGeneratingChange, onConversationUpdated, quickAction, onQuickActionHandled }) {
  const inputRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Cập nhật trạng thái tạo câu trả lời ở component hiện tại và thông báo trạng thái này cho Chat.jsx
  const updateGeneratingState = useCallback(
    (value) => {
      setIsGenerating(value);

      onGeneratingChange?.(value);
    },
    [onGeneratingChange]
  );

  const sendMessage = useCallback(
    async (content) => {
      const trimmedContent =
        content?.trim();

      if (
        isGenerating ||
        !activeConversationId ||
        !trimmedContent
      ) {
        return;
      }

      const userMessage = {
        role: "user",
        content: trimmedContent
      };

      const assistantPlaceholder = {
        role: "assistant",
        content: ""
      };

      // Hiển thị ngay tin nhắn của người dùng và tạo vị trí trống để cập nhật câu trả lời của AI
      setChatMessages((previous) => [
        ...previous,
        userMessage,
        assistantPlaceholder
      ]);

      updateGeneratingState(true);

      try {
        await streamChatRequest(
          activeConversationId,
          trimmedContent,

          (textDelta) => {
            setChatMessages((previous) => {
              const updatedMessages = [
                ...previous
              ];

              const assistantIndex =
                updatedMessages.length - 1;


              updatedMessages[
                assistantIndex
              ] = {
                ...updatedMessages[
                assistantIndex
                ],

                content:
                  updatedMessages[
                    assistantIndex
                  ].content +
                  textDelta
              };

              return updatedMessages;
            });
          }
        );

        await onConversationUpdated?.();

      } catch (error) {

        console.error(error);

        toast.error(
          error.message ||
          "Không thể tạo câu trả lời"
        );

        // Xóa tin nhắn chờ của AI nếu quá trình tạo câu trả lời xảy ra lỗi
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
    }, [activeConversationId, isGenerating, onConversationUpdated, updateGeneratingState]
  );

  //  Khi người dùng chuyển sang hội thoại khác, tải danh sách tin nhắn của hội thoại được chọn.
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



  useEffect(() => {
    if (!quickAction || !quickAction.prompt) return;

    const executeQuickAction = async () => {
      try {

        await sendMessage(
          quickAction.prompt
        );

      } finally {

        onQuickActionHandled?.();

      }
    };

    executeQuickAction();

  }, [quickAction, sendMessage, onQuickActionHandled]);



  const handleSubmit = async () => {
    if (isGenerating || !activeConversationId) return;

    const content = inputRef.current?.value.trim();

    if (!content) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    await sendMessage(content);
  };


  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        bgcolor: "#1a1f2e",
        overflow: "hidden",
      }}
    >
      {/* Khu vực hiển thị tin nhắn trong hội thoại */}
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
          boxSizing: "border-box"
        }}
      >
        {chatMessages.map((chat, index) => {
          const isThinking =
            isGenerating &&
            index === chatMessages.length - 1 &&
            chat.role === "assistant" &&
            chat.content === "";

          if (isThinking) {
            return (
              <Box
                key={`loading-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                }}
              >
                <Box
                  component="img"
                  src={loadingSpinner}
                  alt="Đang tạo câu trả lời"
                  sx={{
                    width: "52px",
                    height: "52px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            );
          }

          return (
            <ChatItem
              key={
                chat.id ??
                `${chat.role}-${index}`
              }
              role={chat.role}
              content={chat.content}
            />
          );
        })}
      </Box>

      {/* Khu vực nhập và gửi tin nhắn đến AI */}
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
            bgcolor: "#111b27",
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