import { Box, Typography, Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { IoIosLogIn } from "react-icons/io";
import { toast } from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";



function Signup() {
  const navigate = useNavigate();

  const auth = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get('name');
    const email = formData.get("email");
    const password = formData.get("password");

    try {

      toast.loading('Signing Up', {id: 'signup'});

      await auth?.signup(name, email, password);

      toast.success('Signing Up Successfully', {id: 'signup'});

    } catch (error) {
      
      console.log(error);
      toast.error('Signing Up Failed', {id: 'signup'});

    }
  };

  useEffect(() => {
    if (auth?.user) {
      return navigate('/chat');
    }
  }, [auth])

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
      }}
    >
      {/* Left side - Robot */}
      <Box
        sx={{
          flex: 1,
          display: {
            xs: "none",
            md: "flex",
          },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src="/robot.png"
          alt="Robot"
          style={{ width: "200px" }}
        />
      </Box>

      {/* Right side - Login */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "400px",
            padding: "30px",
            boxShadow: "10px 10px 20px #000",
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 600,
              mb: 2,
            }}
          >
            Đăng ký
          </Typography>

          <form onSubmit={handleSubmit}>
            <CustomizedInput
              type="text"
              name="name"
              label="Name"
            />

            <CustomizedInput
              type="email"
              name="email"
              label="Email"
            />
            <CustomizedInput
              type="password"
              name="password"
              label="Mật khẩu"
            />

            <Button
              type="submit"
              sx={{
                px: 2,
                py: 1,
                mt: 2,
                width: "400px",
                borderRadius: 2,
                bgcolor: "#00E5FF",
                ":hover": {
                  bgcolor: "white",
                  color: "black"
                }
              }}
              endIcon={<IoIosLogIn />}
            >
              Đăng ký
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}



export default Signup;