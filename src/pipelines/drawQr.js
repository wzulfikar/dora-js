import 'tracking'
import dayjs from 'dayjs'
import jsQR from 'jsqr'
import {drawLine} from '../utils'

// const pipelineName = 'drawQr'

let guiInitialized = false
export const initPipeline = async (canvas) => {
  if (guiInitialized) {
    return
  }

  guiInitialized = true
}

const style = {color: "#FF3B58", lineWidth: 3}

const maxQrList = 3
let listQr = []

export const handler = (canvas, image) => {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });

  if (code) {
    drawLine(ctx, code.location.topLeftCorner, code.location.topRightCorner, style);
    drawLine(ctx, code.location.topRightCorner, code.location.bottomRightCorner, style);
    drawLine(ctx, code.location.bottomRightCorner, code.location.bottomLeftCorner, style);
    drawLine(ctx, code.location.bottomLeftCorner, code.location.topLeftCorner, style);
    
    ctx.fillStyle = '#00';
    ctx.fillText(code.data, code.location.topLeftCorner.x, code.location.topLeftCorner.y - 10);

    // decode qr and append to list
    if (listQr[listQr.length - 1] === undefined || listQr[listQr.length - 1].decoded !== code.data) {
      if (code.data.trim().length === 0) {
        console.log('[INFO] detected empty code data:', code)
      } else {
        if (listQr.length + 1 > maxQrList) {
          listQr.shift()
        }
        listQr.push({
          time: dayjs().format('HH:mm:ss'),
          decoded: code.data,
        })
        console.log("[INFO] code data:", code)
      }
    }
  }

  // draw decoded qr
  if (listQr.length === 0) {
    ctx.fillStyle = '#ffffff'
    const text = 'scanned qr data will be displayed here.'
    const width = ctx.measureText(text).width;
    const y = ctx.canvas.height - 20
    ctx.fillRect(10, y - 5, width + 10, parseInt(ctx.font, 10) + 10);
    
    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'top';
    ctx.fillText(text, 10 + 5, y);
  }

  listQr.forEach((qr, i) => {
    const x = 10
    let y = canvas.height - ((i + 1) * 20)

    const text = `[${qr.time}] ${qr.decoded}`
    const width = ctx.measureText(text).width;

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x - 5, y - 5, width + 10, parseInt(ctx.font, 10) + 10);
    
    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'top';
    ctx.fillText(text, 10, y);
  })
}
