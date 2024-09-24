export const drawOnCanvas = (canvas, elements) => {
  const ctx = canvas.getContext("2d");
  elements.forEach((element) => {
    if (element.type === "rectangle") {
      ctx.fillRect(element.x, element.y, element.width, element.height);
    } else if (element.type === "circle") {
      ctx.beginPath();
      ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
};
