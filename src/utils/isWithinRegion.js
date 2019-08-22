// check if given region contains given x and y points
const isWithinRegion = (region, x, y) => {
    const withinX = region[0].x <= x && x <= region[1].x
    const withinY = region[0].y <= y && y <= region[1].y
    return withinX && withinY
}

export default isWithinRegion