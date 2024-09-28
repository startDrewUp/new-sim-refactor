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
  Typography,
  Divider,
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
  setGridColor,
  selectShowGrid,
  selectSnapToGrid,
  selectGridColor,
} from "../redux/slices/gridSlice";
import {
  setPolylineMode,
  selectPolylineMode,
  finalizePolyline,
} from "../redux/slices/polylineSlice";
import { clearCanvas } from "../redux/thunks/canvasThunks";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import TimelineIcon from "@mui/icons-material/Timeline";
import GridOnIcon from "@mui/icons-material/GridOn";
import GridOffIcon from "@mui/icons-material/GridOff";
import ColorLensIcon from "@mui/icons-material/ColorLens";

const ToolbarContainer = styled(Paper)(({ theme }) => ({
  width: 240,
  height: "100%",
  backgroundColor: "#1E1E1E", // Dark space gray
  color: theme.palette.common.white,
  borderRight: 'none',
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  boxShadow: '4px 0 6px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: -2,
    bottom: 0,
    width: 2,
    background: 'black',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
}));

const ToolbarSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
}));

const ToolbarButton = styled(Button)(({ theme }) => ({
  justifyContent: "flex-start",
  width: "100%",
  textAlign: "left",
  padding: theme.spacing(0.75, 1),
  marginBottom: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  color: theme.palette.common.white,
  transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
  fontSize: '0.8rem',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.grey[400],
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  margin: theme.spacing(1, 0),
}));

const Toolbar = () => {
  const dispatch = useDispatch();
  const showGrid = useSelector(selectShowGrid);
  const snapToGrid = useSelector(selectSnapToGrid);
  const gridColor = useSelector(selectGridColor);
  const polylineMode = useSelector(selectPolylineMode);
  const [openDialog, setOpenDialog] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
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

  const handleGridColorChange = (color) => {
    dispatch(setGridColor(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`));
  };

  return (
    <ToolbarContainer elevation={0}>
      <ToolbarSection>
        <SectionTitle>Add Elements</SectionTitle>
        <ToolbarButton startIcon={<AddBoxIcon />} onClick={() => setOpenDialog(true)}>
          Add Item
        </ToolbarButton>
        <ToolbarButton
          startIcon={<TimelineIcon />}
          onClick={handleTogglePolylineMode}
          color={polylineMode ? "primary" : "inherit"}
        >
          {polylineMode ? "Finish Polyline" : "Add Polyline"}
        </ToolbarButton>
      </ToolbarSection>

      <StyledDivider />

      <ToolbarSection>
        <SectionTitle>Canvas Actions</SectionTitle>
        <ToolbarButton startIcon={<DeleteSweepIcon />} onClick={() => dispatch(clearCanvas())}>
          Clear Canvas
        </ToolbarButton>
        <ToolbarButton startIcon={<ZoomOutMapIcon />} onClick={() => dispatch(requestFitToView())}>
          Fit to View
        </ToolbarButton>
      </ToolbarSection>

      <StyledDivider />

      <ToolbarSection>
        <SectionTitle>Edit Actions</SectionTitle>
        <ToolbarButton startIcon={<UndoIcon />} onClick={() => dispatch(undo())}>
          Undo
        </ToolbarButton>
        <ToolbarButton startIcon={<RedoIcon />} onClick={() => dispatch(redo())}>
          Redo
        </ToolbarButton>
      </ToolbarSection>

      <StyledDivider />

      <ToolbarSection>
        <SectionTitle>Grid Settings</SectionTitle>
        <ToolbarButton
          startIcon={showGrid ? <GridOnIcon /> : <GridOffIcon />}
          onClick={() => dispatch(toggleGrid())}
        >
          {showGrid ? "Hide Grid" : "Show Grid"}
        </ToolbarButton>
        <ToolbarButton
          startIcon={snapToGrid ? <GridOnIcon /> : <GridOffIcon />}
          onClick={() => dispatch(toggleSnapToGrid())}
        >
          {snapToGrid ? "Disable Snap" : "Enable Snap"}
        </ToolbarButton>
        <ToolbarButton
          startIcon={<ColorLensIcon />}
          onClick={() => setOpenColorPicker(true)}
        >
          Grid Color
        </ToolbarButton>
      </ToolbarSection>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
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
              <Typography gutterBottom>Color</Typography>
              <SketchPicker
                color={itemColor}
                onChangeComplete={(color) => setItemColor(color.hex)}
              />
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

      <Dialog open={openColorPicker} onClose={() => setOpenColorPicker(false)} maxWidth="xs">
        <DialogTitle>Choose Grid Color</DialogTitle>
        <DialogContent>
          <SketchPicker
            color={gridColor}
            onChangeComplete={handleGridColorChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenColorPicker(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </ToolbarContainer>
  );
};

export default Toolbar;