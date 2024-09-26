import React, { useState } from "react";
import {
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  Button,
  Box,
  Snackbar,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/Upload";
import { useDispatch } from "react-redux";
import {
  saveCanvasState,
  loadCanvasStateThunk,
} from "../redux/thunks/canvasThunks";

const HeaderButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
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
      <AppBar position="static" color="default" elevation={1}>
        <MuiToolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            Facility Layout
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <HeaderButton startIcon={<SaveIcon />} onClick={handleSaveCanvas}>
              Save
            </HeaderButton>
            <input
              accept=".json"
              style={{ display: "none" }}
              id="load-canvas-file"
              type="file"
              onChange={handleLoadCanvas}
            />
            <label htmlFor="load-canvas-file">
              <HeaderButton component="span" startIcon={<UploadIcon />}>
                Load
              </HeaderButton>
            </label>
            <IconButton color="inherit">
              <MoreVertIcon />
            </IconButton>
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
