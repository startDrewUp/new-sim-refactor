// src/components/Toolbar.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { SketchPicker } from "react-color";
import {
  requestAddItem,
  requestFitToView,
  undo,
  redo,
} from "../redux/slices/layoutSlice";
import {
  toggleGrid,
  toggleSnapToGrid,
  selectShowGrid,
  selectSnapToGrid,
} from "../redux/slices/gridSlice";
import { setPolylineMode, addPolyline } from "../redux/slices/polylineSlice";
import { clearCanvas } from "../redux/thunks/canvasThunks";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import PolylineIcon from "@mui/icons-material/Timeline"; // New icon for Polyline

// Styled Button using Material UI's built-in styling
const ToolbarButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  fontWeight: 600,
  padding: "8px 16px",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[2],
  },
}));

const Toolbar = () => {
  const dispatch = useDispatch();
  const showGrid = useSelector(selectShowGrid);
  const snapToGrid = useSelector(selectSnapToGrid);
  const polylineMode = useSelector((state) => state.layout.polylineMode);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemColor, setItemColor] = useState("#4CAF50");
  const [itemWidth, setItemWidth] = useState(5);
  const [itemHeight, setItemHeight] = useState(5);

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: itemName,
      color: itemColor,
      width: itemWidth,
      height: itemHeight,
      x: 0,
      y: 0,
    };

    dispatch(requestAddItem(newItem));

    setOpenDialog(false);
    setItemName("");
    setItemColor("#4CAF50");
    setItemWidth(5);
    setItemHeight(5);
  };

  const handleAddPolyline = () => {
    dispatch(setPolylineMode(true));
  };

  return (
    <Paper
      sx={{
        width: 300,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "auto",
        borderRight: "none",
        bgcolor: "background.default",
        minHeight: "calc(100vh - 80px)",
        boxShadow: "none",
      }}
      elevation={0}
    >
      <ToolbarButton
        variant="contained"
        onClick={() => setOpenDialog(true)}
        startIcon={<AddBoxIcon />}
        color="primary"
      >
        Add Item
      </ToolbarButton>
      <ToolbarButton
        variant="contained"
        onClick={handleAddPolyline}
        startIcon={<PolylineIcon />}
        color="secondary"
      >
        Add Polyline
      </ToolbarButton>
      <ToolbarButton
        variant="contained"
        onClick={() => dispatch(clearCanvas())}
        startIcon={<DeleteSweepIcon />}
        color="secondary"
      >
        Clear Canvas
      </ToolbarButton>
      <ToolbarButton
        variant="contained"
        onClick={() => dispatch(requestFitToView())}
        startIcon={<ZoomOutMapIcon />}
        color="primary"
      >
        Fit to View
      </ToolbarButton>
      <ToolbarButton
        variant="contained"
        onClick={() => dispatch(undo())}
        startIcon={<UndoIcon />}
        color="primary"
      >
        Undo
      </ToolbarButton>
      <ToolbarButton
        variant="contained"
        onClick={() => dispatch(redo())}
        startIcon={<RedoIcon />}
        color="primary"
      >
        Redo
      </ToolbarButton>
      <Tooltip title="Toggle Grid Visibility">
        <Box>
          <ToolbarButton
            variant="outlined"
            onClick={() => dispatch(toggleGrid())}
            color="primary"
            fullWidth
            sx={{ textTransform: "none" }}
          >
            {showGrid ? "Hide Grid" : "Show Grid"}
          </ToolbarButton>
        </Box>
      </Tooltip>
      <Tooltip title="Toggle Snap to Grid">
        <Box>
          <ToolbarButton
            variant="outlined"
            onClick={() => dispatch(toggleSnapToGrid())}
            color="primary"
            fullWidth
            sx={{ textTransform: "none" }}
          >
            {snapToGrid ? "Disable Snap" : "Enable Snap to Grid"}
          </ToolbarButton>
        </Box>
      </Tooltip>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Item Name"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <SketchPicker
                  color={itemColor}
                  onChangeComplete={(color) => setItemColor(color.hex)}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Width (feet)"
                type="number"
                fullWidth
                value={itemWidth}
                onChange={(e) => setItemWidth(Number(e.target.value))}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Height (feet)"
                type="number"
                fullWidth
                value={itemHeight}
                onChange={(e) => setItemHeight(Number(e.target.value))}
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <ToolbarButton
            onClick={handleAddItem}
            variant="contained"
            color="primary"
          >
            Add
          </ToolbarButton>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Toolbar;
