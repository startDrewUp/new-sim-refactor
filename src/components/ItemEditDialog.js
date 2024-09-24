import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { SketchPicker } from "react-color";
import { updateItem } from "../redux/slices/layoutSlice";

const ItemEditDialog = ({ item, open, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setColor(item.color);
      setWidth(item.width);
      setHeight(item.height);
    }
  }, [item]);

  const handleSave = () => {
    dispatch(updateItem({ id: item.id, name, color, width, height }));
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            autoFocus
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <SketchPicker
              color={color}
              onChangeComplete={(color) => setColor(color.hex)}
            />
          </Box>
          <TextField
            label="Width (feet)"
            type="number"
            fullWidth
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Height (feet)"
            type="number"
            fullWidth
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            inputProps={{ min: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemEditDialog;
