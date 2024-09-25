// src/App.js

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import theme from "../theme"; // Adjust the path based on your project structure
import Header from "./Header";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";

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
          <Canvas />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
