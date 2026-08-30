import { Link } from "react-router";
import { Typography } from "@mui/material";

function Logo() {
  return (
    <div style={{
      display: "flex",
      marginRight: "auto",
      alignItems: "center",
      gap: "8px"
    }}>
      <Link to={"/"}>
        <Typography sx={{
          display: {
            md: "block",
            sm: "none",
            xs: "none"
          },
          mr: "auto",
          fontWeight: "800",
          textShadow: "2px 2px 20px #800"
        }}>
          <span style={{
            fontSize: "20px"
          }}>MERN</span>-GPT
        </Typography>
      </Link>
    </div>
  )
};

export default Logo;