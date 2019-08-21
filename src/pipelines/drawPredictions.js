import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const strToColor = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (var i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

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

  // font options
  ctx.font = "16px sans-serif";
  ctx.textBaseline = "top";

  if (!isModelLoaded) {
    drawText(ctx, "loading model.. (~32MB)")
    return
  }

  predictions.forEach(prediction => {
    drawPredictionBox(ctx, prediction)
  })
}

const drawText = (ctx, text) => {
  ctx.fillStyle = "#000000";
  ctx.fillText(text, 10, 10);
}

const drawPredictionBox = (ctx, prediction) => {
  const x = prediction.bbox[0];
  const y = prediction.bbox[1];
  const width = prediction.bbox[2];
  const height = prediction.bbox[3];

  // Draw the bounding box.
  ctx.strokeStyle = strToColor(prediction.class);
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, width, height);

  // Draw the label background.
  ctx.fillStyle = strToColor(prediction.class);
  const textWidth = ctx.measureText(prediction.class).width;
  const textHeight = parseInt(ctx.font, 10); // base 10
  ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

  // Draw the text last to ensure it's on top.
  ctx.fillStyle = "#000000";
  ctx.fillText(prediction.class, x, y);
}
