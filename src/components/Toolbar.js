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
  List,
  ListItem,
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
import {
  setPolylineMode,
  selectPolylineMode,
  setPolylineStyle,
  finalizePolyline,
} from "../redux/slices/polylineSlice";
import { clearCanvas } from "../redux/thunks/canvasThunks";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import PolylineIcon from "@mui/icons-material/Timeline";
import GridOnIcon from "@mui/icons-material/GridOn";
import GridOffIcon from "@mui/icons-material/GridOff";

const ToolbarButton = styled(Button)(({ theme }) => ({
  justifyContent: "flex-start",
  width: "100%",
  textAlign: "left",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

const Toolbar = () => {
  const dispatch = useDispatch();
  const showGrid = useSelector(selectShowGrid);
  const snapToGrid = useSelector(selectSnapToGrid);
  const polylineMode = useSelector(selectPolylineMode);
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

  const handleTogglePolylineMode = () => {
    if (polylineMode) {
      dispatch(finalizePolyline());
    }
    dispatch(setPolylineMode(!polylineMode));
  };

  return (
    <Paper
      sx={{
        width: 240,
        height: "100%",
        overflowY: "auto",
        bgcolor: "background.paper",
      }}
      elevation={0}
    >
      <List>
        <ListItem>
          <ToolbarButton
            startIcon={<AddBoxIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add Item
          </ToolbarButton>
        </ListItem>
        <ListItem>
          <ToolbarButton
            startIcon={<PolylineIcon />}
            onClick={handleTogglePolylineMode}
            color={polylineMode ? "primary" : "default"}
          >
            {polylineMode ? "Finish Polyline" : "Add Polyline"}
          </ToolbarButton>
        </ListItem>
        <ListItem>
          <ToolbarButton
            startIcon={<DeleteSweepIcon />}
            onClick={() => dispatch(clearCanvas())}
          >
            Clear Canvas
          </ToolbarButton>
        </ListItem>
        <ListItem>
          <ToolbarButton
            startIcon={<ZoomOutMapIcon />}
            onClick={() => dispatch(requestFitToView())}
          >
            Fit to View
          </ToolbarButton>
        </ListItem>
        <ListItem>
          <ToolbarButton
            startIcon={<UndoIcon />}
            onClick={() => dispatch(undo())}
          >
            Undo
          </ToolbarButton>
        </ListItem>
        <ListItem>
          <ToolbarButton
            startIcon={<RedoIcon />}
            onClick={() => dispatch(redo())}
          >
            Redo
          </ToolbarButton>
        </ListItem>
        <ListItem>
          <ToolbarButton
            startIcon={showGrid ? <GridOnIcon /> : <GridOffIcon />}
            onClick={() => dispatch(toggleGrid())}
          >
            {showGrid ? "Hide Grid" : "Show Grid"}
          </ToolbarButton>
        </ListItem>
        <ListItem>
          <ToolbarButton
            startIcon={snapToGrid ? <GridOnIcon /> : <GridOffIcon />}
            onClick={() => dispatch(toggleSnapToGrid())}
          >
            {snapToGrid ? "Disable Snap" : "Enable Snap to Grid"}
          </ToolbarButton>
        </ListItem>
      </List>

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
          <Button onClick={handleAddItem} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Toolbar;
