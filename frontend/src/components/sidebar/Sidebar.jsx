import { Box, Typography, Button, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { FiLogOut, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import getInitials from "../../utils/get-initials.js";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";



function Sidebar({
  conversations,
  activeConversationId,
  isGenerating,
  user,

  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onLogout
}) {
  const auth = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const [menuConversationId, setMenuConversationId] = useState(null);

  const handleOpenMenu = (event, conversationId) => {
    /*
     * Prevent the conversation itself
     * from being selected when clicking ...
     */
    event.stopPropagation();

    setMenuAnchorEl(event.currentTarget);

    setMenuConversationId(conversationId);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setMenuConversationId(null);
  };

  const handleDelete = async () => {
    if (!menuConversationId) return;

    const conversationId = menuConversationId;

    handleCloseMenu();

    await onDeleteConversation(conversationId);
  };



  return (
    <>
      {/* Sidebar */}
      <Box
        sx={{
          width: "320px",
          height: "100%",
          flexShrink: 0,
          bgcolor: "#2e2e51",
          display: {
            xs: "none",
            sm: "none",
            md: "flex"
          },
          flexDirection: "column",
          p: 1.5,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >

        {/* Upload document */}
        <Button
          onClick={onNewConversation}
          disabled={isGenerating}
          startIcon={<FiPlusCircle size={21} />}
          sx={{
            height: "52px",
            color: "white",
            border: "1px dashed #777",
            borderRadius: "6px",
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 700,
            bgcolor: "transparent",
            mb: 2,

            "&:hover": {
              bgcolor: "#51538f",
              borderColor: "#aaa"
            },

            "&.Mui-disabled": {
              color: "#777",
              borderColor: "#555"
            }
          }}
        >
          Tải tài liệu mới
        </Button>

        {/* Conversation list */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >

          {conversations.map(
            (conversation) => {

              const isActive =
                activeConversationId ===
                conversation._id;

              return (

                <Box
                  key={conversation._id}
                  onClick={() => {
                    if (!isGenerating) {
                      onSelectConversation(
                        conversation._id
                      );
                    }
                  }}

                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    minWidth: 0,
                    minHeight: "52px",
                    mb: 1,
                    px: 1.5,
                    boxSizing: "border-box",
                    borderRadius: "5px",
                    bgcolor:
                      isActive
                        ? "#51538f"
                        : "transparent",

                    cursor:
                      isGenerating
                        ? "default"
                        : "pointer",

                    transition:
                      "background-color 0.2s ease",

                    "&:hover": {
                      bgcolor:
                        "#51538f"
                    }
                  }}
                >

                  {/* Title */}
                  <Typography
                    noWrap
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      color: "white",
                      fontSize: "16px",
                      fontWeight:
                        isActive
                          ? 600
                          : 400
                    }}
                  >
                    {conversation.title}
                  </Typography>

                  {/* 3 dots */}
                  <IconButton
                    disabled={isGenerating}
                    onClick={(
                      event
                    ) =>
                      handleOpenMenu(
                        event,
                        conversation._id
                      )
                    }

                    sx={{
                      color: "#aaa",
                      ml: 1,
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(255,255,255,0.08)"
                      }
                    }}
                  >
                    <HiOutlineDotsHorizontal
                      size={23}
                    />
                  </IconButton>

                </Box>

              );
            }
          )}

        </Box>

        {/* User section */}
        <Box
          sx={{
            borderTop: "1px solid #3a4150",
            pt: 2
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1,
              py: 1
            }}
          >

            {/* Avatar */}
            <Avatar
              sx={{
                ml: "0",
                bgcolor: "black",
                color: "white",
                flexShrink: 0,
              }}
            >
              {/* Display the first letter of both First and Last name */}
              {getInitials(auth?.user?.name)}
            </Avatar>

            {/* User name */}
            <Typography
              sx={{
                color: "white",
                fontSize: "16px"
              }}
            >
              {user?.name}
            </Typography>

          </Box>


          {/* Logout */}
          <Button
            onClick={onLogout}
            startIcon={
              <FiLogOut
                size={22}
              />
            }

            sx={{
              justifyContent: "flex-start",
              color: "white",
              textTransform: "none",
              width: "100%",
              fontSize: "16px",
              px: 2,
              mt: 1,

              "&:hover": {
                bgcolor:
                  "#51538f"
              }
            }}

          >
            Đăng xuất
          </Button>

        </Box>

      </Box>


      {/* Conversation menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: "190px",
              borderRadius: "8px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.15)"
            }
          }
        }}
      >

        <MenuItem
          onClick={
            handleDelete
          }
          sx={{
            color:
              "#d32f2f",
            fontSize:
              "15px"
          }}
        >
          <FiTrash2 
            size={19} 
            style={{ marginRight: "8px" }}
          />
          Xóa cuộc trò chuyện
        </MenuItem>
      </Menu>
    </>
  );
}

export default Sidebar;