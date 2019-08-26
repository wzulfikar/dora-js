const drawInfoBox = (ctx, text) => {
    ctx.fillStyle = '#ffffff'
    const width = ctx.measureText(text).width;
    const y = ctx.canvas.height - 20
    ctx.fillRect(10, y - 5, width + 10, parseInt(ctx.font, 10) + 10);

    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'top';
    ctx.fillText(text, 10 + 5, y);
}

export default drawInfoBox