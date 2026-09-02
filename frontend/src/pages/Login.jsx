import { Box, Typography, Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { IoIosLogIn } from "react-icons/io";
import { toast } from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";



function Login() {
  const auth = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {

      toast.loading('Signing In', {id: 'login'});

      await auth?.login(email, password);

      toast.success('Signing In Successfully', {id: 'login'});

    } catch (error) {
      
      console.log(error);
      toast.error('Signing In Failed', {id: 'login'});

    }
  };

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
            Đăng nhập
          </Typography>

          <form onSubmit={handleSubmit}>
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
              Đăng Nhập
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}


// function Login() {
//   return (
//     <Box
//       width="100%"
//       height="100%"
//       display="flex"
//     >
//       <Box
//         padding={8}
//         mt={8}
//         display={{ 
//           md: "flex", 
//           sm: "none", 
//           xs: "none" 
//         }}
//       >
//         <img
//           src="robot.png"
//           alt="Robot"
//           style={{ width: "200px" }}
//         />
//       </Box>

//       <Box
//         display="flex"
//         flex={{
//           xs: 1,
//           md: 0.5
//         }}
//         justifyContent="center"
//         alignItems="center"
//         padding={2}
//         ml="auto"
//         mt={16}
//       >
//         <form style={{
//           margin: "auto",
//           padding: "30px",
//           boxShadow: "10px 10px 20px #000",
//           borderRadius: "10x",
//           border: "none"
//           }}
//         >
//           <Box 
//             sx={{
//               display: 'flex', 
//               flexDirection: "column", 
//               justifyContent: "center"
//             }}
//           >
//             <Typography
//               variant="h4"
//               textAlign="center"
//               padding={2}
//               fontWeight={600}
//             >
//               Login
//             </Typography>
//           </Box>
//         </form>
//       </Box>
//     </Box>
//   )
// };

export default Login;