// get region of rectangle area
const getRectRegion = (x, y, w, h) => {
    return [
        { x, y }, 
        { x: x + w, y: y + h }
    ]
}

export default getRectRegion