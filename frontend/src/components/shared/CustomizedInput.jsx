import { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";

function CustomizedInput(props) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = props.type === "password";

  return (
    <TextField
      fullWidth
      margin="normal"
      name={props.name}
      label={props.label}
      type={
        isPassword && showPassword
          ? "text"
          : props.type
      }
      slotProps={{
        inputLabel: {
          sx: {
            color: "white",

            "&.Mui-focused": {
              color: "white",
            },
          },
        },

        input: {
          sx: {
            width: "100%",
            borderRadius: 2,
            fontSize: {
              xs: 16,
              sm: 20,
            },
            color: "white",
            boxSizing: "border-box",
          },

          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                edge="end"
                sx={{
                  color: "white",
                }}
                aria-label={
                  showPassword
                    ? "Ẩn mật khẩu"
                    : "Hiện mật khẩu"
                }
              >
                {showPassword ? (
                  <IoEyeOffOutline />
                ) : (
                  <IoEyeOutline />
                )}
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}

export default CustomizedInput;