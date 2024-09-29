import React from "react";
import { useSelector } from "react-redux";
import CanvasItem from "./CanvasItem";
import { selectItems, selectSelectedItemId } from "../redux/slices/layoutSlice";
import { selectTransform } from "../redux/slices/transformSlice";
import { selectGridSize, selectSnapToGrid } from "../redux/slices/gridSlice";
import useItemInteractions from "../hooks/useItemInteractions";

const CanvasItems = ({ onEditItem }) => {
  const items = useSelector(selectItems);
  const selectedItemId = useSelector(selectSelectedItemId);
  const transform = useSelector(selectTransform);
  const gridSize = useSelector(selectGridSize);
  const snapToGrid = useSelector(selectSnapToGrid);

  const { toggleItemSelection, handleItemMouseDown } = useItemInteractions();

  console.log("CanvasItems rendering, items:", items); // Debugging log

  return (
    <>
      {items.map((item) => (
        <CanvasItem
          key={item.id}
          item={item}
          isSelected={item.id === selectedItemId}
          onSelect={toggleItemSelection}
          onEdit={onEditItem}
          handleItemMouseDown={handleItemMouseDown}
          transform={transform}
          gridSize={gridSize}
          snapToGrid={snapToGrid}
        />
      ))}
    </>
  );
};

export default React.memo(CanvasItems);