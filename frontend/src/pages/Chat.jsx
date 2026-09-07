import { Box, Avatar, Typography, Button, IconButton } from '@mui/material';
import { IoMdSend } from 'react-icons/io';
import { red } from '@mui/material/colors';
import { useAuth } from '../context/AuthContext';
import ChatItem from '../components/chat/ChatItem';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getUserChats, sendChatRequest } from '../helpers/api-communicator.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';



function Chat() {
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const auth = useAuth();

  const [chatMessages, setChatMessages] = useState([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value;

    if (inputRef && inputRef.current) {
      inputRef.current.value = '';
    };

    const newMessage = {
      role: 'user',
      content
    };

    setChatMessages((prev) => [...prev, newMessage]);

    const chatData = await sendChatRequest(content);

    setChatMessages([...chatData.chats])
  };

  // Fetch all chats of user on refresh
  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" })
        })
        .catch(error => {
          console.log(error);
          toast.error("Loading failed", { id: "loadchats" })
        })
    }
  }, [auth]);

  // Protected Routes and Logout user request
  useEffect(() => {
    if (!auth?.user) {
      return navigate('/login')
    }
  }, [auth])

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: {
            md: "flex",
            xs: "none",
            sm: "none"
          },
          flex: 0.2,
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "#2e2e51",
            borderRadius: 5,
            flexDirection: "column",
            mx: (3),
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: (2),
              bgcolor: "white",
              color: "black",
              fontWeight: 700
            }}
          >
            {/* Display the first letter of both First and Last name */}
            {auth?.user?.name[0]}
            {auth?.user?.name.split(" ")[1][0]}
          </Avatar>
          <Typography
            sx={{
              mx: "auto",
            }}
          >
            You are talking to a ChatBot
          </Typography>
          <Typography
            sx={{
              mx: "auto",
              my: (4),
              p: (3)
            }}
          >
            Bạn có thể hỏi các câu liên quan đến kinh doanh, giáo dục, v.v. Nhưng đừng chia sẻ thông tin cá nhân
          </Typography>
          <Button
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400
              }
            }}
          >
            Xóa cuộc trò chuyện
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flex: {
            md: 0.8,
            xs: 1,
            sm: 1
          },
          flexDirection: "column",
          px: 3,
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: '40px',
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600"
          }}
        >
          Gemini 3.8 Flash
        </Typography>

        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
            minWidth: 0,
          }}
        >
          {chatMessages.map((chat, index) =>
            <ChatItem
              content={chat.content}
              role={chat.role}
              key={index}
            />
          )}
        </Box>

        <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17, 27, 39)",
            display: "flex",
            margin: "auto",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            style={{
              width: '100%',
              backgroundColor: "transparent",
              padding: "24px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />
          <IconButton
            onClick={handleSubmit}
            sx={{
              ml: "auto",
              color: "white",
            }}
          >
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  )
}

export default Chat;