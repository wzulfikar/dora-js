import init, {detect} from 'edge-detection-wasm';

export const initPipeline = async () => {
  const wasmUrl = "http://127.0.0.1:5500/node_modules/edge-detection-wasm/edge_detection_wasm_bg.wasm"
  await init(wasmUrl);
}

export const handler = (canvas, image, edgeColor = 0xFF9E24FF) => {
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

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
