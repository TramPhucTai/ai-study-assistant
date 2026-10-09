import { Box, Typography, Button, IconButton, Menu, MenuItem, Avatar, Drawer } from "@mui/material";
import { FiLogOut, FiPlusCircle, FiTrash2, FiMenu, FiX } from "react-icons/fi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import getInitials from "../../utils/get-initials.js";
import { useAuth } from "../../context/useAuth.js";
import { useState } from "react";



function Sidebar({
  conversations,
  activeConversationId,
  isGenerating,
  user,

  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onLogout,
}) {
  const auth = useAuth();

  const [
    menuAnchorEl,
    setMenuAnchorEl,
  ] = useState(null);

  const [
    menuConversationId,
    setMenuConversationId,
  ] = useState(null);

  const [
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  ] = useState(false);



  const handleOpenMenu = (
    event,
    conversationId
  ) => {
    event.stopPropagation();

    setMenuAnchorEl(
      event.currentTarget
    );

    setMenuConversationId(
      conversationId
    );
  };



  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setMenuConversationId(null);
  };



  const handleDelete = async () => {
    if (!menuConversationId) {
      return;
    }

    const conversationId =
      menuConversationId;

    handleCloseMenu();

    await onDeleteConversation(
      conversationId
    );
  };



  const handleSelect = (
    conversationId
  ) => {
    if (isGenerating) {
      return;
    }

    onSelectConversation(
      conversationId
    );

    // Close mobile sidebar
    setIsMobileSidebarOpen(
      false
    );
  };



  const handleNew = () => {
    if (isGenerating) {
      return;
    }

    onNewConversation();

    setIsMobileSidebarOpen(
      false
    );
  };



  const handleLogout = async () => {
    setIsMobileSidebarOpen(
      false
    );

    await onLogout();
  };



  /*
   * Reusable sidebar content.
   *
   * It is used by:
   * - Desktop permanent sidebar
   * - Mobile Drawer
   */
  const sidebarContent = (
    <Box
      sx={{
        width: "320px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#2e2e51",
        p: 1.5,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Mobile header */}
      <Box
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },
          alignItems: "center",
          justifyContent:
            "space-between",
          mb: 1.5,
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          LuminousPDF
        </Typography>

        <IconButton
          onClick={() =>
            setIsMobileSidebarOpen(
              false
            )
          }
          sx={{
            color: "white",
          }}
        >
          <FiX size={25} />
        </IconButton>
      </Box>



      {/* Upload document */}
      <Button
        onClick={handleNew}
        disabled={isGenerating}
        startIcon={
          <FiPlusCircle
            size={21}
          />
        }
        sx={{
          height: "52px",
          color: "white",

          border:
            "1px dashed #777",

          borderRadius: "6px",

          textTransform:
            "none",

          fontSize: "15px",
          fontWeight: 700,

          bgcolor:
            "transparent",

          mb: 2,

          "&:hover": {
            bgcolor:
              "#51538f",

            borderColor:
              "#aaa",
          },

          "&.Mui-disabled": {
            color:
              "#777",

            borderColor:
              "#555",
          },
        }}
      >
        Tải tài liệu mới
      </Button>



      {/* Conversation list */}
      <Box
        sx={{
          flex: 1,

          overflowY:
            "auto",

          overflowX:
            "hidden",
        }}
      >
        {conversations.map(
          (conversation) => {
            const isActive =
              activeConversationId ===
              conversation._id;

            return (
              <Box
                key={
                  conversation._id
                }
                onClick={() =>
                  handleSelect(
                    conversation._id
                  )
                }
                sx={{
                  display: "flex",
                  alignItems:
                    "center",

                  width: "100%",
                  minWidth: 0,
                  minHeight:
                    "52px",

                  mb: 1,

                  px: 1.5,

                  boxSizing:
                    "border-box",

                  borderRadius:
                    "5px",

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
                      "#51538f",
                  },
                }}
              >
                {/* Title */}
                <Typography
                  noWrap
                  sx={{
                    flex: 1,
                    minWidth: 0,

                    color:
                      "white",

                    fontSize:
                      "16px",

                    fontWeight:
                      isActive
                        ? 600
                        : 400,
                  }}
                >
                  {
                    conversation.title
                  }
                </Typography>



                {/* 3 dots */}
                <IconButton
                  disabled={
                    isGenerating
                  }
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
                      color:
                        "white",

                      bgcolor:
                        "rgba(255,255,255,0.08)",
                    },
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
          borderTop:
            "1px solid #3a4150",

          pt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",

            alignItems:
              "center",

            gap: 1.5,

            px: 1,
            py: 1,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "black",

              color: "white",

              flexShrink: 0,

              width: 48,
              height: 48,
            }}
          >
            {getInitials(
              auth?.user?.name
            )}
          </Avatar>

          <Typography
            noWrap
            sx={{
              color: "white",
              fontSize: "16px",
            }}
          >
            {user?.name}
          </Typography>
        </Box>



        {/* Logout */}
        <Button
          onClick={
            handleLogout
          }
          startIcon={
            <FiLogOut
              size={22}
            />
          }
          sx={{
            justifyContent:
              "flex-start",

            color: "white",

            textTransform:
              "none",

            width: "100%",

            fontSize:
              "16px",

            px: 2,
            mt: 1,

            "&:hover": {
              bgcolor:
                "#51538f",
            },
          }}
        >
          Đăng xuất
        </Button>
      </Box>
    </Box>
  );



  return (
    <>
      {/* ========================= */}
      {/* Mobile menu button */}
      {/* ========================= */}
      <IconButton
        onClick={() =>
          setIsMobileSidebarOpen(
            true
          )
        }
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },

          position: "fixed",

          top: {
            xs: "10px",
            sm: "14px",
          },

          left: {
            xs: "12px",
            sm: "14px",
          },

          width: 44,
          height: 44,

          zIndex: 1200,

          color: "white",

          bgcolor:
            "#2e2e51",

          border:
            "1px solid #475569",

          borderRadius:
            "8px",

          boxShadow:
            "0 2px 8px rgba(0,0,0,0.25)",

          "&:hover": {
            bgcolor:
              "#51538f",
          },
        }}
      >
        <FiMenu size={24} />
      </IconButton>



      {/* ========================= */}
      {/* Desktop Sidebar */}
      {/* ========================= */}
      <Box
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          width:
            "320px",

          height:
            "100%",

          flexShrink: 0,
        }}
      >
        {sidebarContent}
      </Box>



      {/* ========================= */}
      {/* Mobile Sidebar */}
      {/* ========================= */}
      <Drawer
        anchor="left"
        open={
          isMobileSidebarOpen
        }
        onClose={() =>
          setIsMobileSidebarOpen(
            false
          )
        }
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper":
          {
            width:
              "min(320px, 85vw)",

            bgcolor:
              "#2e2e51",

            borderRight:
              "1px solid #475569",

            boxSizing:
              "border-box",
          },
        }}
      >
        {sidebarContent}
      </Drawer>



      {/* Conversation menu */}
      <Menu
        anchorEl={
          menuAnchorEl
        }
        open={
          Boolean(
            menuAnchorEl
          )
        }
        onClose={
          handleCloseMenu
        }
        anchorOrigin={{
          vertical:
            "bottom",

          horizontal:
            "right",
        }}
        transformOrigin={{
          vertical:
            "top",

          horizontal:
            "right",
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth:
                "190px",

              borderRadius:
                "8px",

              boxShadow:
                "0 4px 18px rgba(0,0,0,0.15)",
            },
          },
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
              "15px",
          }}
        >
          <FiTrash2
            size={19}
            style={{
              marginRight:
                "8px",
            }}
          />

          Xóa cuộc trò chuyện
        </MenuItem>
      </Menu>
    </>
  );
}

export default Sidebar;