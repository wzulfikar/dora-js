import 'tracking'
import { useGui } from '../datGui'

const pipelineName = 'drawRectangle'
const datGuiNamespace = `datGuiPipeline_${pipelineName}`

let guiInitialized = false
export const initPipeline = async (canvas) => {
  if (guiInitialized) {
    return
  }

  const gui = useGui()
  const folder = gui.addFolder('Pipeline: drawRectangle')
  window[datGuiNamespace] = {
    'Stroke': '#000000',
    'Fill': '#000000',
    'x': 10,
    'y': 10,
    'Width': 100,
    'Height': 100,
    'Line width': 4,
    'Set center': false,
    'Set fill': false,
  }

  folder.add(window[datGuiNamespace], 'x', 0, canvas.width);
  folder.add(window[datGuiNamespace], 'y', 0, canvas.height);
  folder.add(window[datGuiNamespace], 'Width', 0, canvas.width);
  folder.add(window[datGuiNamespace], 'Height', 0, canvas.height);
  folder.add(window[datGuiNamespace], 'Line width', 0, 10);
  folder.addColor(window[datGuiNamespace], 'Stroke');
  folder.addColor(window[datGuiNamespace], 'Fill');
  folder.add(window[datGuiNamespace], 'Set center');
  folder.add(window[datGuiNamespace], 'Set fill');

  folder.open()

  guiInitialized = true
}

export const handler = (canvas, image) => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let {
      Stroke,
      x,
      y,
      Width,
      Height
    } = window[datGuiNamespace]

    ctx.lineWidth = window[datGuiNamespace]['Line width'];
    ctx.strokeStyle = Stroke;

    if (window[datGuiNamespace]['Set center']) {
      const centerPoint = getCenterPoint(canvas, Width, Height)
      x = centerPoint.x
      y = centerPoint.y
    }

    if (window[datGuiNamespace]['Set fill']) {
      ctx.fillStyle = window[datGuiNamespace]['Fill'];
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
