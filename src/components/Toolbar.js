// src/components/Toolbar.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Button,
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { SketchPicker } from "react-color";
import {
  clearCanvas,
  toggleGrid,
  toggleSnapToGrid,
  setPolylineMode,
  addItem,
  requestFitToView,
  undo,
  redo,
} from "../redux/slices/layoutSlice";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: "all 0.3s ease",
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: "bold",
  textTransform: "none",
  borderRadius: 20,
  fontFamily: theme.typography.fontFamily,
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
  marginBottom: theme.spacing(1),
}));

const Toolbar = () => {
  const dispatch = useDispatch();
  const { showGrid, snapToGrid, polylineMode } = useSelector(
    (state) => state.layout
  );
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

    dispatch(addItem(newItem));

    setOpenDialog(false);
    setItemName("");
    setItemColor("#4CAF50");
    setItemWidth(5);
    setItemHeight(5);
  };

  const handleFitToView = () => {
    dispatch(requestFitToView());
  };

  const handleUndo = () => {
    dispatch(undo());
  };

  const handleRedo = () => {
    dispatch(redo());
  };

  return (
    <Paper
      sx={{
        width: 300,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "auto",
        borderRight: "none",
        bgcolor: "primary.main",
        minHeight: "calc(100vh - 80px)",
        boxShadow: "none",
      }}
      elevation={0}
    >
      <AnimatedButton
        variant="contained"
        onClick={() => setOpenDialog(true)}
        startIcon={<AddBoxIcon />}
      >
        Add Item
      </AnimatedButton>
      <AnimatedButton
        variant="contained"
        onClick={() => dispatch(clearCanvas())}
        startIcon={<DeleteSweepIcon />}
      >
        Clear Canvas
      </AnimatedButton>
      <AnimatedButton
        variant="contained"
        onClick={handleFitToView}
        startIcon={<ZoomOutMapIcon />}
      >
        Fit to View
      </AnimatedButton>
      <AnimatedButton
        variant="contained"
        onClick={handleUndo}
        startIcon={<UndoIcon />}
      >
        Undo
      </AnimatedButton>
      <AnimatedButton
        variant="contained"
        onClick={handleRedo}
        startIcon={<RedoIcon />}
      >
        Redo
      </AnimatedButton>
      <FormControlLabel
        control={
          <Switch
            checked={showGrid}
            onChange={() => dispatch(toggleGrid())}
            color="secondary"
          />
        }
        label="Show Grid"
        sx={{ mt: 1, color: "secondary.main", fontFamily: "inherit" }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={snapToGrid}
            onChange={() => dispatch(toggleSnapToGrid())}
            color="secondary"
          />
        }
        label="Snap to Grid"
        sx={{ color: "secondary.main", fontFamily: "inherit" }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={polylineMode}
            onChange={() => dispatch(setPolylineMode(!polylineMode))}
            color="secondary"
          />
        }
        label="Draw Polyline"
        sx={{ color: "secondary.main", fontFamily: "inherit" }}
      />
      {/* Dialog for adding new item */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: "inherit" }}>Add New Item</DialogTitle>
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
          <AnimatedButton onClick={handleAddItem} variant="contained">
            Add
          </AnimatedButton>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Toolbar;
