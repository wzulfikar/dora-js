import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

// load lib codes
import { initDatGui, types } from './lib/datGui'
import webcamStreamer from "./lib/webcamStreamer";
import pipelineProvider from "./lib/pipelineProvider";

// add your pipelines here
const pipelineHandlers = {
  drawRectangle: require('./pipelines/drawRectangle'),
  drawEdges: require('./pipelines/drawEdges'),
  drawCorners: require('./pipelines/drawCorners'),
  drawPredictions: require('./pipelines/drawPredictions'),
}

const App = () => {
  const videoRef = React.createRef();
  const canvasRef = React.createRef();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const [datgui$, datguiConfig] = initDatGui(pipelineHandlers)
  const [canvasW, canvasH] = datguiConfig['Canvas size'].split('x')
  const [canvasSize, setCanvasSize] = useState({w: canvasW, h: canvasH})

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("error: could not get user media");
      return;
    }

    datgui$.subscribe({
      next: ({type, payload}) => {
        if (type === types.CANVAS_SIZE) {
          const [w, h] = payload
          setCanvasSize({w, h})
          return
        }
      }
    })

    const webcamPromise = webcamStreamer(videoRef.current)
    const processFramePromise = pipelineProvider(canvasRef.current, pipelineHandlers)

    Promise.all([
      webcamPromise,
      processFramePromise,
    ])
    .then(([webcam, processFrame]) => {
      processFrame(canvasRef.current, videoRef.current);
      setIsLoading(false);
    })
    .catch(e => {
      setError(e);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [canvasSize]);

  return (
    <div>
      {isLoading && !error && <span className="canvas-info">waiting for webcam..</span>}
      {error && <span className="canvas-info" style={{ color: "red" }}>error: {error.message}</span>}
      <video
        className="size"
        autoPlay
        playsInline
        muted
        ref={videoRef}
        width={canvasSize.w}
        height={canvasSize.h}
      />
      <canvas className="size" ref={canvasRef} width={canvasSize.w} height={canvasSize.h} />
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
