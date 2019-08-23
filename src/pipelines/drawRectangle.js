import 'tracking'
import { useGuiFolder, useGuiObj } from '../lib/datGui'

const pipelineName = 'drawRectangle'

let guiInitialized = false
export const initPipeline = async (canvas) => {
  if (guiInitialized) {
    return
  }

  const {folder, guiObj, isActive} = useGuiFolder(pipelineName, {
    'Stroke': '#000000',
    'Fill': '#000000',
    'x': 10,
    'y': 10,
    'Width': 100,
    'Height': 100,
    'Line width': 4,
    'Set center': false,
    'Set fill': false,
  })

  folder.add(guiObj, 'x', 0, canvas.width);
  folder.add(guiObj, 'y', 0, canvas.height);
  folder.add(guiObj, 'Width', 0, canvas.width);
  folder.add(guiObj, 'Height', 0, canvas.height);
  folder.add(guiObj, 'Line width', 0, 10);
  folder.addColor(guiObj, 'Stroke');
  folder.addColor(guiObj, 'Fill');
  folder.add(guiObj, 'Set center');
  folder.add(guiObj, 'Set fill');

  if (isActive) {
    folder.open()
  }

  guiInitialized = true
}

export const handler = (canvas, image) => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const guiObj = useGuiObj(pipelineName)
    let {
      Stroke,
      x,
      y,
      Width,
      Height
    } = guiObj

    ctx.lineWidth = guiObj['Line width'];
    ctx.strokeStyle = Stroke;

    if (guiObj['Set center']) {
      const centerPoint = getCenterPoint(canvas, Width, Height)
      x = centerPoint.x
      y = centerPoint.y
    }

    if (guiObj['Set fill']) {
      ctx.fillStyle = guiObj['Fill'];
      ctx.fillRect(x, y, Width, Height);
    }

    ctx.strokeRect(x, y, Width, Height);
}

const getCenterPoint = (canvas, objWidth, objHeight) => {
  const canvasCenterPoint = {
    x: canvas.width / 2,
    y: canvas.height / 2,
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
