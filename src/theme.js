// src/theme.js

import { createTheme } from "@mui/material/styles";

// Define a modern and neutral color palette
const theme = createTheme({
  palette: {
    mode: "light", // You can switch to "dark" for a dark theme
    primary: {
      main: "#1976d2", // Modern blue
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff4081", // Vibrant pink for accents
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5", // Light gray background
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif", // Modern sans-serif font
    h3: {
      fontWeight: 700,
      letterSpacing: "1px",
    },
    button: {
      textTransform: "none", // Keep button text as-is
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Slightly rounded corners for a modern look
          fontWeight: 600,
          padding: "8px 16px",
          transition: "all 0.3s ease",
        },
        containedPrimary: {
          backgroundColor: "#1976d2",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#115293",
          },
        },
        containedSecondary: {
          backgroundColor: "#ff4081",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#c60055",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#ffffff",
          color: "#1976d2",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "80px",
          display: "flex",
          justifyContent: "space-between",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },
  },
});

export default theme;
