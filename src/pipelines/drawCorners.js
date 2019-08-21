import 'tracking'
import { useGui } from '../datGui'

const {
    Image,
    Fast,
} = window.tracking

let guiInitialized = false
export const initPipeline = async () => {
  if (guiInitialized) {
    return
  }

  const gui = useGui()
  const folder = gui.addFolder('Pipeline: drawCorners')

  window['Fast Threshold'] = 10
  folder.add(window, 'Fast Threshold', 0, 100);
  folder.open()
  guiInitialized = true
}

export const handler = (canvas, image) => {
    window.tracking.Fast.THRESHOLD = window['Fast Threshold']

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
