import { AppBar, Toolbar, Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router";
import NavigationLink from "../components/shared/NavigationLink";
import { useAuth } from "../context/useAuth.js";



function Home() {
  const auth = useAuth();

  if (auth?.isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (auth?.isLoggedIn && auth?.user) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <Box>
      <AppBar
        sx={{
          bgcolor: "transparent",
          position: "static",
          boxShadow: "none"
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <Box>
            <NavigationLink
              bg="#00E5FF"
              to="/login"
              text="Đăng nhập"
              textColor="black"
            />

            <NavigationLink
              bg="#51538f"
              to="/signup"
              text="Đăng ký"
              textColor="white"
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Your homepage content goes here */}
    </Box>
  );
}

export default Home;