import { Box, Typography, Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { IoIosLogIn } from "react-icons/io";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth.js";
import { useEffect } from "react";
import { useNavigate } from "react-router";



function Signup() {
  const navigate = useNavigate();

  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      toast.loading("Đang tạo tài khoản...", { id: "signup" });

      await auth?.signup(name, email, password);

      toast.success("Tạo tài khoản thành công!", { id: "signup" });

    } catch (error) {

      console.log(error);

      const validationErrors = error.response?.data?.errors;

      if (validationErrors && validationErrors.length > 0) {
        toast.error(validationErrors[0].msg, {
          id: "signup",
        });

        return;
      }

      toast.error("Đăng ký thất bại. Vui lòng thử lại.", {
        id: "signup",
      });

    }
  };

  useEffect(() => {
    if (auth?.user) {
      navigate("/chat");
    }
  }, [auth?.user, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        px: {
          xs: 2,
          sm: 3,
        },
        boxSizing: "border-box",
      }}
    >
      {/* Logo */}
      <Box
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 24,
          left: 32,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "28px",
              md: "32px",
            },
            fontWeight: 700,
            lineHeight: 1.1,
            color: "white",
            userSelect: "none",
          }}
        >
          Luminous
          <Box
            component="span"
            sx={{
              color: "#00E5FF",
            }}
          >
            PDF
          </Box>
        </Typography>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: {
            md: 8,
            lg: 10,
          },
        }}
      >
        {/* Robot */}
        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            justifyContent: "center",
            alignItems: "center",
            width: "360px",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src="/robot.png"
            alt="Robot"
            sx={{
              width: "280px",
              height: "auto",
            }}
          />
        </Box>

        {/* Signup box */}
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "400px",
            },
            maxWidth: {
              xs: "340px",
              sm: "400px",
            },
            padding: {
              xs: "20px",
              sm: "30px",
            },
            boxShadow: "10px 10px 20px #000",
            borderRadius: "10px",
            flexShrink: 0,
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 600,
              mb: {
                xs: 1.5,
                sm: 2,
              },
              fontSize: {
                xs: "30px",
                sm: "34px",
              },
            }}
          >
            Đăng ký
          </Typography>

          <form onSubmit={handleSubmit}>
            <CustomizedInput
              type="text"
              name="name"
              label="Họ và tên"
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
                width: "100%",
                borderRadius: 2,
                color: "black",
                bgcolor: "#00E5FF",

                "&:hover": {
                  bgcolor: "white",
                },
              }}
              endIcon={<IoIosLogIn />}
            >
              Đăng ký
            </Button>

            {/* Login section */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                }}
              >
                Đã có tài khoản?
              </Typography>

              <Button
                type="button"
                onClick={() => navigate("/login")}
                sx={{
                  minWidth: "auto",
                  p: 0,
                  textTransform: "none",
                  color: "#00E5FF",
                  fontWeight: 600,
                  fontSize: "14px",

                  "&:hover": {
                    bgcolor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Đăng nhập tại đây
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default Signup;