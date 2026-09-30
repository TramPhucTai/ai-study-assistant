import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";



function CustomizedInput(props) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = props.type === "password";

  return (
    <TextField
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
            width: "400px",
            borderRadius: 2,
            fontSize: 20,
            color: "white",
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