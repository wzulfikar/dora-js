import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

// load lib codes
import { initDatGui } from './lib/datGui'
import webcamStreamer from "./lib/webcamStreamer";
import pipelineProvider from "./lib/pipelineProvider";

// add your pipelines here
const pipelineHandlers = {
  drawRectangle: require('./pipelines/drawRectangle'),
  drawEdges: require('./pipelines/drawEdges'),
  drawCorners: require('./pipelines/drawCorners'),
  drawPredictions: require('./pipelines/drawPredictions'),
}

initDatGui(pipelineHandlers)

const App = () => {
  const videoRef = React.createRef();
  const canvasRef = React.createRef();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("error: could not get user media");
      return;
    }

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
  });

  return (
    <div>
      {isLoading && <span>waiting for webcam..</span>}
      {error && <span style={{ color: "red" }}>ERROR: {error.message}</span>}
      <video
        className="size"
        autoPlay
        playsInline
        muted
        ref={videoRef}
        width="600"
        height="500"
      />
      <canvas className="size" ref={canvasRef} width="600" height="500" />
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
