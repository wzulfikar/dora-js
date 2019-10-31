import getCenterPoint from './getCenterPoint'
import getRectRegion from './getRectRegion'

const BRACKET_WIDTH = 25

const drawSquareMask = (ctx, size, strokeStyle, style = 'Full') => {
    ctx.strokeStyle = strokeStyle;    
    ctx.lineWidth = 1

    const centerPoint = getCenterPoint(ctx.canvas.width, ctx.canvas.height, size, size)
    const region = getRectRegion(centerPoint.x, centerPoint.y, size, size)

    if (style === 'Full') {
        ctx.strokeRect(centerPoint.x, centerPoint.y, size, size);
        return
    }

    if (style === 'Card - vertical') {
        const sizeRatio = 1.5;
        ctx.strokeRect(centerPoint.x * sizeRatio, centerPoint.y, size / sizeRatio, size);
        return
    }

    if (style === 'Card - horizontal') {
        const sizeRatio = 1.5;
        ctx.strokeRect(centerPoint.x, centerPoint.y * sizeRatio, size, size / sizeRatio);
        return
    }

    // uncomment to display full mask overlay (eg. to debug bracket positions)
    // ctx.strokeRect(centerPoint.x, centerPoint.y, size, size);

    /**
     * brackets will be drawn clockwise
     */

    // top-left
    ctx.beginPath();
    ctx.moveTo(region[0].x, region[0].y + BRACKET_WIDTH);
    ctx.lineTo(region[0].x, region[0].y);
    ctx.lineTo(region[0].x + BRACKET_WIDTH, region[0].y);
    ctx.stroke();
  
    // top-right
    ctx.beginPath();
    ctx.moveTo(region[1].x - BRACKET_WIDTH, region[0].y);
    ctx.lineTo(region[1].x, region[0].y);
    ctx.lineTo(region[1].x, region[0].y + BRACKET_WIDTH);
    ctx.stroke();

    // bottom-right
    ctx.beginPath();
    ctx.moveTo(region[1].x, region[1].y - BRACKET_WIDTH);
    ctx.lineTo(region[1].x, region[1].y);
    ctx.lineTo(region[1].x - BRACKET_WIDTH, region[1].y);
    ctx.stroke();

    // bottom-left
    ctx.beginPath();
    ctx.moveTo(region[0].x + BRACKET_WIDTH, region[1].y);
    ctx.lineTo(region[0].x, region[1].y);
    ctx.lineTo(region[0].x, region[1].y - BRACKET_WIDTH);
    ctx.stroke();
}

export default drawSquareMask