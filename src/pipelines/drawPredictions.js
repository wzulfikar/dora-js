// forked from https://codesandbox.io/s/kwmq4v263

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { drawBbox } from '../utils'

let model = {
  isLoading: false,
  isLoaded: false,
}

const loadModel = async () => {
  model.isLoading = true
  console.log('drawPredictions.js: loading model..')

  const modelPromise = cocoSsd.load();
  modelPromise.then(_model => {
    model = _model
    model.isLoaded = true
    console.log('drawPredictions.js: model loaded')
  })
}

export const initPipeline = async () => {
  const createPayload = async image => {
    if (!model.isLoaded) {
      if (!model.isLoading) {
        loadModel()
      }
      return {
        isModelLoaded: false,
        predictions: [],
      }
    }

    return {
      isModelLoaded: true,
      predictions: await model.detect(image)
    }
  }
  return createPayload
}

export const handler = (canvas, image, {predictions, isModelLoaded}) => {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (!isModelLoaded) {
    drawText(ctx, "loading model.. (~32MB)")
    return
  }

  predictions.forEach(prediction => {
    const bbox = {
      x: prediction.bbox[0],
      y: prediction.bbox[1],
      w: prediction.bbox[2],
      h: prediction.bbox[3],
    }
    drawBbox(ctx, bbox, prediction.class)
  })
}

const drawText = (ctx, text) => {
  ctx.fillStyle = "#000000";
  ctx.fillText(text, 10, 10);
}
