import 'tracking'
import { useGuiFolder, useGuiObj } from '../lib/datGui'

const {
    Image,
    Fast,
} = window.tracking

const pipelineName = 'drawCorners'

let guiInitialized = false
export const initPipeline = async () => {
  if (guiInitialized) {
    return
  }

  const {folder, guiObj} = useGuiFolder(pipelineName, {
    'Fast Threshold': 10,
  })
  folder.add(guiObj, 'Fast Threshold', 0, 100);
  folder.open()

  guiInitialized = true
}

export const handler = (canvas, image) => {
    const guiObj = useGuiObj(pipelineName)
    window.tracking.Fast.THRESHOLD = guiObj['Fast Threshold']

    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var gray = Image.grayscale(imageData.data, ctx.canvas.width, ctx.canvas.height);
    var corners = Fast.findCorners(gray, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < corners.length; i += 2) {
      ctx.fillStyle = '#f00';
      ctx.fillRect(corners[i], corners[i + 1], 3, 3);
    }
}
