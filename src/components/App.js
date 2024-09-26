import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import theme from "../theme"; // Adjust the path if necessary
import Header from "../components/Header";
import Toolbar from "../components/Toolbar";
import Canvas from "../components/Canvas";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          bgcolor: "background.default",
        }}
      >
        <Header />
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            overflow: "hidden",
          }}
        >
          <Toolbar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              overflow: "auto",
              bgcolor: "background.default",
            }}
          >
            <Canvas />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
