import strToColor from './strToColor'

const drawBbox = (ctx, bbox, label, style = {}) => {
    let color = style.color
    if (!color) {
        color = label ? strToColor(label) : '#FF0000'
    }

    let font = style.font
    if (!font) {
        ctx.font = "16px sans-serif"
    }
    ctx.textBaseline = "top";

    // Draw the bounding box.
    ctx.strokeStyle = color;
    ctx.strokeRect(bbox.x, bbox.y, bbox.w, bbox.h);
    ctx.lineWidth = 3

    if (!label) {
        return
    }

    // Draw the label background.
    ctx.fillStyle = color;
    const textWidth = ctx.measureText(label).width;
    const textHeight = parseInt(ctx.font, 10); // base 10
    ctx.fillRect(bbox.x, bbox.y, textWidth + 4, textHeight + 4);

    // Draw the text last to ensure it's on top.
    ctx.fillStyle = "#000000";
    ctx.fillText(label, bbox.x, bbox.y + 4);
}

export default drawBbox
