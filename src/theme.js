import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6200ee", // Purple 500
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#03dac6", // Teal 200
      contrastText: "#000000",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: "#ffffff",
          color: "rgba(0, 0, 0, 0.87)",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "64px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
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
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: "8px 0",
        },
      },
    },
  },
});

export default theme;
