const drawLine = (ctx, begin, end, style = {color: '#ff', lineWidth: 4}) => {
    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = style.lineWidth;
    ctx.strokeStyle = style.color;
    ctx.stroke();
}

export default drawLine