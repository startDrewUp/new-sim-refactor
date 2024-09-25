import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Typography,
  TextField,
} from "@mui/material";
import { setGridOpacity, setGridSize } from "../redux/slices/gridSlice";

const CanvasSettings = () => {
  const dispatch = useDispatch();
  const { gridOpacity, gridSize } = useSelector((state) => state.layout);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGridOpacityChange = (event, newValue) => {
    dispatch(setGridOpacity(newValue));
  };

  const handleGridSizeChange = (event) => {
    dispatch(setGridSize(Number(event.target.value)));
  };

  return (
    <>
      <Button color="inherit" onClick={handleOpen}>
        Canvas Settings
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Canvas Settings</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Gridline Opacity</Typography>
          <Slider
            value={gridOpacity}
            onChange={handleGridOpacityChange}
            aria-labelledby="grid-opacity-slider"
            step={0.1}
            marks
            min={0.1}
            max={1}
            valueLabelDisplay="auto"
          />
          <Typography gutterBottom>Grid Size (feet)</Typography>
          <TextField
            type="number"
            value={gridSize}
            onChange={handleGridSizeChange}
            inputProps={{ min: 1, max: 20 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CanvasSettings;
