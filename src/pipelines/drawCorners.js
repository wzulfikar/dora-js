import 'tracking'
import { useGuiFolder, useGuiObj } from '../lib/datGui'
import {
  getCenterPoint,
  getRectRegion,
  drawSquareMask,
} from '../utils'

const {
    Image,
    Fast,
} = window.tracking

const pipelineName = 'drawCorners'
const CORNER_WIDTH = 3

let guiInitialized = false
export const initPipeline = async () => {
  if (guiInitialized) {
    return
  }

  const {folder, guiObj, isActive} = useGuiFolder(pipelineName, {
    'Fast Threshold': 10,
    'Show region': false,
    'Region style': 'bracket',
    'Region color': '#000000',
  })
  folder.add(guiObj, 'Fast Threshold', 0, 100);
  folder.add(guiObj, 'Show region');
  folder.add(guiObj, 'Region style', ['bracket', 'full']);
  folder.addColor(guiObj, 'Region color');

  if (isActive) {
    folder.open()
  }

  guiInitialized = true
}

export const handler = (canvas, image) => {
    const guiObj = useGuiObj(pipelineName)
    window.tracking.Fast.THRESHOLD = guiObj['Fast Threshold']

    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#f00'

    const maskSize = 300
    const centerPoint = getCenterPoint(canvas.width, canvas.height, maskSize, maskSize)
    const region = getRectRegion(centerPoint.x, centerPoint.y, maskSize, maskSize)

    let imageData, gray, corners
    if (guiObj['Show region']) {
      // only find corners in given region area
      imageData = ctx.getImageData(region[0].x, region[0].y, maskSize, maskSize)
      gray = Image.grayscale(imageData.data, maskSize, maskSize)
      corners = Fast.findCorners(gray, maskSize, maskSize)

      drawSquareMask(ctx, maskSize, guiObj['Region color'], guiObj['Region style'])
    } else {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      gray = Image.grayscale(imageData.data, canvas.width, canvas.height)
      corners = Fast.findCorners(gray, canvas.width, canvas.height)
    }

    let regionCorners = 0
    for (let i = 0; i < corners.length; i += 2) {
      let [cornerX, cornerY] = [corners[i], corners[i + 1]]

      // shift corners positions
      if (guiObj['Show region']) {
        cornerX += region[0].x
        cornerY += region[0].y
      }

      ctx.fillRect(cornerX, cornerY, CORNER_WIDTH, CORNER_WIDTH);
      regionCorners++
    }

    const score = (regionCorners / 100).toFixed(1)
    console.log('corner score:', score)
}
