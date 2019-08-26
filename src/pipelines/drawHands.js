import * as handTrack from 'handtrackjs'
import { drawInfoBox } from '../utils'

let model = {
  isLoading: false,
  isLoaded: false,
}

// read more: https://github.com/victordibia/handtrack.js/
const loadModel = async () => {
  model.isLoading = true
  console.log('handtrack.js: loading model..')
  
  const modelParams = {
    flipHorizontal: false,  // flip e.g for video 
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,   // confidence threshold for predictions.
  }

  handTrack.load(modelParams).then(_model => {
    model = _model
    model.isLoaded = true
    console.log('handtrack.js: model loaded')
  });
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

  // font options
  ctx.font = "16px sans-serif";
  ctx.textBaseline = "top";

  if (!isModelLoaded) {
    drawInfoBox(ctx, "loading model..")
    return
  }

  const text = `number of hands in screen: ${predictions.length}`
  drawInfoBox(ctx, text)

  predictions.forEach(prediction => {
    drawPredictionBox(ctx, prediction)
  })
}

const drawPredictionBox = (ctx, prediction) => {
  const x = prediction.bbox[0];
  const y = prediction.bbox[1];
  const width = prediction.bbox[2];
  const height = prediction.bbox[3];

  // Draw the bounding box.
  ctx.strokeStyle = '#0000FF';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
}
