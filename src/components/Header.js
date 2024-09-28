import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
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

const HeaderContainer = styled(AppBar)(({ theme }) => ({
  position: "static",
  backgroundColor: "#1E1E1E", // Dark space gray
  color: theme.palette.common.white,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  zIndex: theme.zIndex.drawer + 1,
}));

const HeaderToolbar = styled(Toolbar)({
  minHeight: '48px',
  paddingLeft: '8px',
  paddingRight: '8px',
});

const HeaderButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  textTransform: 'none',
  padding: theme.spacing(0.5, 1),
  fontSize: '0.8rem',
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
}));

const HeaderIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  padding: theme.spacing(0.5),
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
      <HeaderContainer>
        <HeaderToolbar>
          <HeaderIconButton edge="start" aria-label="menu">
            <MenuIcon />
          </HeaderIconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1, fontSize: '1rem' }}>
            Facility Layout
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <HeaderIconButton aria-label="search">
              <SearchIcon />
            </HeaderIconButton>
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
            <HeaderIconButton aria-label="more">
              <MoreVertIcon />
            </HeaderIconButton>
          </Box>
        </HeaderToolbar>
      </HeaderContainer>
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