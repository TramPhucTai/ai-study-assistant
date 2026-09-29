import { AppBar, Toolbar, Box, Button, CircularProgress, Typography } from "@mui/material";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/useAuth.js";
import { BsChatDots, BsFileEarmarkText, BsQuestionCircle, BsUpload, BsStars, BsCheckCircle } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";



function Home() {
  const auth = useAuth();

  const navigate = useNavigate();

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

  const features = [
    {
      icon: <BsChatDots size={34} />,
      title: "Hỏi đáp thông minh",
      description:
        "Đặt câu hỏi về tài liệu và nhận câu trả lời chi tiết, dễ hiểu từ AI",
    },
    {
      icon: <BsFileEarmarkText size={34} />,
      title: "Tóm tắt tài liệu",
      description:
        "Tóm tắt nhanh nội dung chính của tài liệu PDF để tiết kiệm thời gian học tập",
    },
    {
      icon: <BsQuestionCircle size={34} />,
      title: "Tạo Quiz ôn tập",
      description:
        "Tạo câu hỏi trắc nghiệm từ tài liệu để kiểm tra và củng cố kiến thức",
    },
  ];


  const steps = [
    {
      icon: <BsUpload size={30} />,
      title: "Tải tài liệu lên",
      description:
        "Đăng nhập và tải tài liệu PDF mà bạn muốn học lên hệ thống",
    },
    {
      icon: <BsStars size={30} />,
      title: "Học cùng AI",
      description:
        "Đặt câu hỏi, yêu cầu giải thích, tóm tắt hoặc tạo bài Quiz từ tài liệu",
    },
    {
      icon: <BsCheckCircle size={30} />,
      title: "Ôn tập kiến thức",
      description:
        "Xem lại nội dung quan trọng và kiểm tra kiến thức bằng các câu hỏi Quiz",
    },
  ];


  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <AppBar
        sx={{
          bgcolor: "transparent",
          position: "static",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            px: {
              xs: 2,
              md: 5,
            },
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
            }}
          >
            <Button
              onClick={() => navigate("/login")}
              sx={{
                height: "48px",
                px: 2.5,
                bgcolor: "#00E5FF",
                color: "black",
                borderRadius: "7px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,

                "&:hover": {
                  bgcolor: "white",
                },
              }}
            >
              Đăng nhập
            </Button>

            <Button
              onClick={() => navigate("/signup")}
              sx={{
                height: "48px",
                px: 2.5,
                bgcolor: "#51538f",
                color: "white",
                borderRadius: "7px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,

                "&:hover": {
                  bgcolor: "#35375b",
                },
              }}
            >
              Đăng ký
            </Button>
          </Box>
        </Toolbar>
      </AppBar>


      {/* Hero section */}
      <Box
        sx={{
          minHeight: "320px",
          maxWidth: "1000px",
          mx: "auto",
          px: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: {
            xs: 4,
            md: 10,
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        {/* Robot */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: {
              xs: "100%",
              md: "360px",
            },
          }}
        >
          <Box
            component="img"
            src="/robot.png"
            alt="LuminousPDF Robot"
            sx={{
              width: {
                xs: "220px",
                md: "280px",
              },
              height: "auto",
            }}
          />
        </Box>

        {/* Welcome */}
        <Box
          sx={{
            textAlign: {
              xs: "center",
              md: "left",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "18px",
                md: "20px",
              },
              mb: 1,
              color: "#cbd5e1",
            }}
          >
            Chào mừng đến với
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "36px",
                md: "48px",
              },
              fontWeight: 700,
              lineHeight: 1.1,
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

          <Typography
            sx={{
              mt: 2,
              maxWidth: "450px",
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#9ca3af",
            }}
          >
            Trợ lý học tập thông minh giúp bạn hiểu tài liệu PDF,
            tóm tắt nội dung và tạo câu hỏi ôn tập với sự hỗ trợ của AI.
          </Typography>

          <Button
            onClick={() => navigate("/signup")}
            endIcon={<FiArrowRight />}
            sx={{
              mt: 3,
              height: "48px",
              px: 3,
              bgcolor: "#00E5FF",
              color: "black",
              borderRadius: "7px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,

              "&:hover": {
                bgcolor: "white",
              },
            }}
          >
            Bắt đầu ngay
          </Button>
        </Box>
      </Box>


      {/* Features */}
      <Box
        sx={{
          maxWidth: "1100px",
          mx: "auto",
          px: 3,
          mt: 4,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: 700,
            mb: 4,
          }}
        >
          Tính năng
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {features.map((feature) => (
            <Box
              key={feature.title}
              sx={{
                p: 3,
                minHeight: "180px",
                bgcolor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "12px",
                textAlign: "center",
                transition: "0.2s ease",

                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: "#00E5FF",
                },
              }}
            >
              <Box
                sx={{
                  color: "#00E5FF",
                  mb: 2,
                }}
              >
                {feature.icon}
              </Box>

              <Typography
                sx={{
                  fontSize: "19px",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {feature.title}
              </Typography>

              <Typography
                sx={{
                  color: "#9ca3af",
                  lineHeight: 1.6,
                  fontSize: "15px",
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>


      {/* How it works */}
      <Box
        sx={{
          maxWidth: "1100px",
          mx: "auto",
          px: 3,
          py: 8,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: 700,
            mb: 5,
          }}
        >
          Cách hoạt động
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 2,

            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={step.title}
              sx={{
                display: "contents",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  textAlign: "center",
                  maxWidth: "300px",
                  mx: "auto",
                }}
              >
                {/* Step number */}
                <Box
                  sx={{
                    width: "52px",
                    height: "52px",
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    bgcolor: "#00E5FF",
                    color: "black",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  {index + 1}
                </Box>

                <Box
                  sx={{
                    color: "#00E5FF",
                    mb: 1.5,
                  }}
                >
                  {step.icon}
                </Box>

                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {step.title}
                </Typography>

                <Typography
                  sx={{
                    color: "#9ca3af",
                    lineHeight: 1.6,
                    fontSize: "15px",
                  }}
                >
                  {step.description}
                </Typography>
              </Box>

              {index < steps.length - 1 && (
                <Box
                  sx={{
                    display: {
                      xs: "none",
                      md: "flex",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 3,
                    color: "#64748b",
                  }}
                >
                  <FiArrowRight size={34} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Home;