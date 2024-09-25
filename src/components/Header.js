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
import {
  saveCanvasState,
  loadCanvasStateThunk,
} from "../redux/thunks/canvasThunks";

// Styled Button using Material UI's built-in styling
const HeaderButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  fontWeight: 600,
  padding: "8px 16px",
  transition: "transform 0.2s ease",
  "&:hover": {
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
          dispatch(loadCanvasStateThunk(canvasState));
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
      <AppBar position="static">
        <MuiToolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            Facility Layout
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <CanvasSettings />
            <HeaderButton startIcon={<HomeIcon />}>Home</HeaderButton>
            <HeaderButton startIcon={<SettingsIcon />}>Settings</HeaderButton>
            <HeaderButton startIcon={<HelpIcon />}>Help</HeaderButton>
            <HeaderButton
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
              onClick={handleSaveCanvas}
            >
              Save Canvas
            </HeaderButton>
            <input
              accept=".json"
              style={{ display: "none" }}
              id="load-canvas-file"
              type="file"
              onChange={handleLoadCanvas}
            />
            <label htmlFor="load-canvas-file">
              <HeaderButton
                component="span"
                startIcon={<UploadIcon />}
                variant="contained"
                color="secondary"
              >
                Load Canvas
              </HeaderButton>
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
