// src/components/App.js
import React from "react";
import { CssBaseline, Box } from "@mui/material";
import Header from "./Header";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";

const App = () => {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Header sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }} />
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
    </>
  );
};

export default App;
