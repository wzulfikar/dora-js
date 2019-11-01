import getCenterPoint from "./getCenterPoint";
import getRectRegion from "./getRectRegion";

const BRACKET_WIDTH = 25;
const RECT_RATIO = 1.5;

export const maskStyles = {
  bracket: "Bracket",
  cardHorizontal: "Card - horizontal",
  cardVertical: "Card - vertical",
  square: "Square"
};

export const drawSquareMask = (ctx, size, strokeStyle, maskStyle) => {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 1;

  const centerPoint = getCenterPoint(
    ctx.canvas.width,
    ctx.canvas.height,
    size,
    size
  );
  const region = getRectRegion(centerPoint.x, centerPoint.y, size, size);

  // uncomment to display square mask overlay (eg. to debug bracket positions)
  // ctx.strokeRect(centerPoint.x, centerPoint.y, size, size);

  switch (maskStyle) {
    case maskStyles.square:
      ctx.strokeRect(centerPoint.x, centerPoint.y, size, size);
      return;
    case maskStyles.bracket:
      drawBracket(ctx, region, BRACKET_WIDTH);
      return;
    case maskStyles.cardVertical:
      // Shift center point to right and reduce square's width by `RECT_RATIO` percent
      ctx.strokeRect(
        centerPoint.x * RECT_RATIO,
        centerPoint.y,
        size / RECT_RATIO,
        size
      );
      return;
    case maskStyles.cardHorizontal:
      // Shift down center point and reduce square's height by `RECT_RATIO` percent
      ctx.strokeRect(
        centerPoint.x,
        centerPoint.y * RECT_RATIO,
        size,
        size / RECT_RATIO
      );
      return;
  }
};

/**
 * brackets will be drawn clockwise
 */
const drawBracket = (ctx, region, width) => {
  // top-left
  ctx.beginPath();
  ctx.moveTo(region[0].x, region[0].y + width);
  ctx.lineTo(region[0].x, region[0].y);
  ctx.lineTo(region[0].x + width, region[0].y);
  ctx.stroke();

  // top-right
  ctx.beginPath();
  ctx.moveTo(region[1].x - width, region[0].y);
  ctx.lineTo(region[1].x, region[0].y);
  ctx.lineTo(region[1].x, region[0].y + width);
  ctx.stroke();

  // bottom-right
  ctx.beginPath();
  ctx.moveTo(region[1].x, region[1].y - width);
  ctx.lineTo(region[1].x, region[1].y);
  ctx.lineTo(region[1].x - width, region[1].y);
  ctx.stroke();

  // bottom-left
  ctx.beginPath();
  ctx.moveTo(region[0].x + width, region[1].y);
  ctx.lineTo(region[0].x, region[1].y);
  ctx.lineTo(region[0].x, region[1].y - width);
  ctx.stroke();
};

export default drawSquareMask;
