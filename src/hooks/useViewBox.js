// src/hooks/useViewBox.js

import { useState, useEffect } from "react";

const useViewBox = (containerRef) => {
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: 1000,
    height: 1000,
  });

  useEffect(() => {
    const updateViewBox = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewBox({ x: 0, y: 0, width: rect.width, height: rect.height });
      }
    };

    updateViewBox();

    window.addEventListener("resize", updateViewBox);
    return () => {
      window.removeEventListener("resize", updateViewBox);
    };
  }, [containerRef]);

  return viewBox;
};

export default useViewBox;
