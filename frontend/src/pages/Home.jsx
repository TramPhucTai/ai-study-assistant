import { AppBar, Toolbar, Box } from "@mui/material";

import Logo from "../components/shared/Logo";
import NavigationLink from "../components/shared/NavigationLink";

import { useAuth } from "../context/useAuth.js";



function Home() {
  const auth = useAuth();

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
            justifyContent: "space-between"
          }}
        >
          <Logo />

          <Box>
            {auth?.isLoggedIn ? (
              <NavigationLink
                bg="#00E5FF"
                to="/chat"
                text="Go To Chat"
                textColor="black"
              />
            ) : (
              <>
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
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Your homepage content goes here */}
    </Box>
  );
}

export default Home;