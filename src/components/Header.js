// src/components/Header.js

import React, { useState } from "react";
import {
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  Button,
  Box,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import CanvasSettings from "./CanvasSettings";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/Upload";
import { useDispatch } from "react-redux";
import { saveCanvasState, loadCanvasState } from "../redux/slices/layoutSlice";

const AnimatedButton = styled(Button)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: 20,
  padding: "8px 16px",
  fontWeight: "bold",
  textTransform: "none",
  fontFamily: theme.typography.fontFamily,
  transition: "background-color 0.3s ease, transform 0.2s ease",
  color: theme.palette.secondary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    transform: "translateY(-2px)",
  },
}));

const Header = () => {
  const dispatch = useDispatch();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSaveCanvas = () => {
    dispatch(saveCanvasState());
    setSnackbarMessage("Canvas saved successfully");
    setOpenSnackbar(true);
  };

  const handleLoadCanvas = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Read the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const canvasState = JSON.parse(e.target.result);
          dispatch(loadCanvasState(canvasState.layout));
          setSnackbarMessage("Canvas loaded successfully");
          setOpenSnackbar(true);
        } catch (error) {
          console.error("Error loading canvas:", error);
          setSnackbarMessage("Failed to load canvas");
          setOpenSnackbar(true);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{ bgcolor: "primary.main", boxShadow: "none" }}
      >
        <MuiToolbar sx={{ minHeight: "80px" }}>
          <Typography
            variant="h3"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              letterSpacing: "1px",
              fontFamily: "inherit",
              color: "secondary.main",
            }}
          >
            Facility Layout
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <CanvasSettings />
            <AnimatedButton startIcon={<HomeIcon />}>Home</AnimatedButton>
            <AnimatedButton startIcon={<SettingsIcon />}>
              Settings
            </AnimatedButton>
            <AnimatedButton startIcon={<HelpIcon />}>Help</AnimatedButton>
            <AnimatedButton startIcon={<SaveIcon />} onClick={handleSaveCanvas}>
              Save Canvas
            </AnimatedButton>
            <input
              accept=".json"
              style={{ display: "none" }}
              id="load-canvas-file"
              type="file"
              onChange={handleLoadCanvas}
            />
            <label htmlFor="load-canvas-file">
              <AnimatedButton component="span" startIcon={<UploadIcon />}>
                Load Canvas
              </AnimatedButton>
            </label>
          </Box>
        </MuiToolbar>
      </AppBar>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default Header;
