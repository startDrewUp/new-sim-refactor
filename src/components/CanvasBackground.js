import React from "react";
import { useSelector } from "react-redux";
import useGridLines from "../hooks/useGridLines";
import { selectTransform } from "../redux/slices/transformSlice";

const CanvasBackground = ({ viewBox }) => {
  const transform = useSelector(selectTransform);
  const gridLines = useGridLines(viewBox);

  return (
    <g>
      {gridLines}
    </g>
  );
};

export default React.memo(CanvasBackground);