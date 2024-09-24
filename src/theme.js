// src/theme.js

import { createTheme } from "@mui/material/styles";

// Define your color palette
const lightGreen = "#A8E6CF"; // Nice light green
const darkBrown = "#5D4037"; // Dark brown for contrast
const neutral = "#FFFFFF"; // White for neutral backgrounds

const theme = createTheme({
  palette: {
    primary: {
      main: lightGreen,
    },
    secondary: {
      main: darkBrown,
    },
    background: {
      default: neutral,
    },
  },
  typography: {
    fontFamily: "'Fredoka One', cursive",
  },
});

export default theme;
