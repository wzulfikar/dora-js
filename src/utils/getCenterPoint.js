// get center point of canvas relative to given object
const getCenterPoint = (canvasW, canvasH, objWidth, objHeight) => {
    const canvasCenterPoint = {
        x: canvasW / 2,
        y: canvasH / 2,
    }

    const objectCenterPoint = {
        x: objWidth / 2,
        y: objHeight / 2,
    }

    return {
        x: canvasCenterPoint.x - objectCenterPoint.x,
        y: canvasCenterPoint.y - objectCenterPoint.y,
    }
}

export default getCenterPoint