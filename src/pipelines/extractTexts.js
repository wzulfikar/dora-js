import * as Tesseract from 'tesseract.js';

import {
  drawBbox,
} from '../utils'

// const pipelineName = 'extractTexts'

let guiInitialized = false

const curateResult = result => {
  result.lines = result.lines.filter(line => line.confidence > 50 && line.text.trim().length > 10)
  if (result.lines.length) {
    console.log('result:', result)
    return result
  }
  return null
}

export const initPipeline = async () => {
  if (guiInitialized) {
    return
  }

  guiInitialized = true

  let isLoading = false
  let lastResult = null
  let frameCount = 0
  const createPayload = async image => {
    frameCount++
    if (isLoading || frameCount < 20) {
      return {
        tesseractResult: lastResult,
      }
    }

    frameCount = 0
    isLoading = true
    const tesseractResult = await Tesseract.recognize(image, {
      lang: 'eng',
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    })
      .progress(progress => {
        // no-op
        if (progress.status === 'recognizing text') {
          // console.log('hold still')
        }
      })
      .then(result => curateResult(result));

    isLoading = false
    lastResult = tesseractResult

    return {
      tesseractResult
    }
  }
  return createPayload
}

export const handler = (canvas, image, { tesseractResult }) => {
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#f00'

  if (tesseractResult) {
    // TODO: upload `image` to google vision
    tesseractResult.lines.forEach(line => {
      const bbox = {
        x: line.bbox.x0,
        y: line.bbox.y0,
        w: line.bbox.x1,
        h: 1,
      }
      drawBbox(ctx, bbox, line.text.trim(), "#FF0000")
    })
  }
}
