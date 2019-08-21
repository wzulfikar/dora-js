import init, {detect} from 'edge-detection-wasm';

let wasmState = {
  isLoaded: false
}

export const initPipeline = async () => {
  const wasmUrl = "/static/edge_detection_wasm_bg.wasm"
  init(wasmUrl).then(() => {
    wasmState.isLoaded = true
  });
}

export const handler = (canvas, image, edgeColor = 0xFF9E24FF) => {
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  if (!wasmState.isLoaded) {
    ctx.fillStyle = "#000000";
    ctx.fillText("loading wasm binary..", 10, 10);
    return
  }

  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const edges = detect(
      imageData.data,
      ctx.canvas.width,
      ctx.canvas.height,
      edgeColor,
      true
    );
  ctx.putImageData(new ImageData(edges, ctx.canvas.width, ctx.canvas.height), 0, 0);
}
