import { TextField } from "@mui/material";

function CustomizedInput(props) {
  return (
    <TextField
      margin="normal"
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
        },
      }}
      name={props.name}
      label={props.label}
      type={props.type}
    />
  );
}

// function CustomizedInput(props) {
//   return (
//     <TextField
//       margin="normal"
//       InputLabelProps={{
//         style: {
//           color: "white"
//         }
//       }}
//       InputProps={{style: {
//         width: "400px", 
//         borderRadius: 10,
//         fontSize: 20,
//         color: "white"
//       }}}
//       name={props.name}
//       label={props.label}
//       type={props.type}
//     />
//   );
// }

export default CustomizedInput;

