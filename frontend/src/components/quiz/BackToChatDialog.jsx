import {
  Box,
  Button,
  Dialog,
  Typography,
} from "@mui/material";



function BackToChatDialog({
  open,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "440px",
            maxWidth: "90vw",
            borderRadius: "8px",
            bgcolor: "#2e2e51",
            m: 2,
          },
        },

        backdrop: {
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.65)",
          },
        },
      }}
    >
      <Box
        sx={{
          px: 4,
          pt: 3.5,
          pb: 3,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "25px",
            fontWeight: 600,
            color: "white",
            mb: 3,
          }}
        >
          Quay lại Chat?
        </Typography>

        {/* Warning message */}
        <Typography
          sx={{
            textAlign: "center",
            color: "#d1d5db",
            fontSize: "17px",
            lineHeight: 1.7,
            mb: 5,
          }}
        >
          Quiz hiện tại sẽ bị mất và bạn
          sẽ không thể quay lại Quiz này
          sau khi trở về Chat.
        </Typography>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <Button
            fullWidth
            onClick={onClose}
            sx={{
              height: "56px",
              bgcolor: "#51538f",
              color: "white",
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "18px",
              fontWeight: 500,

              "&:hover": {
                bgcolor: "#111b27",
              },
            }}
          >
            Ở lại Quiz
          </Button>

          <Button
            fullWidth
            onClick={onConfirm}
            sx={{
              height: "56px",
              bgcolor: "#00E5FF",
              color: "#000000",
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "18px",
              fontWeight: 600,

              "&:hover": {
                bgcolor: "white",
              },
            }}
          >
            Quay lại Chat
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default BackToChatDialog;