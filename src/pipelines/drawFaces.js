// Adapted from https://github.com/eduardolundgren/tracking.js/blob/master/examples/face_camera.html //

import "tracking";
import "tracking/build/data/face-min";

import { useGuiFolder, useGuiObj } from "../lib/datGui";
import { drawSquareMask } from "../utils";

const pipelineName = "drawFaces";

let guiInitialized = false;
export const initPipeline = async () => {
  if (guiInitialized) {
    return;
  }

  const { folder, guiObj, isActive } = useGuiFolder(pipelineName, {
    "Fast Threshold": 10,
    "Show region": false,
    "Region style": "bracket",
    "Region color": "#000000"
  });
  folder.add(guiObj, "Fast Threshold", 0, 100);
  folder.add(guiObj, "Show region");
  folder.add(guiObj, "Region style", ["bracket", "full"]);
  folder.addColor(guiObj, "Region color");

  if (isActive) {
    folder.open();
  }

  guiInitialized = true;
};

export const handler = (canvas, image) => {
  const guiObj = useGuiObj(pipelineName);
  window.tracking.Fast.THRESHOLD = guiObj["Fast Threshold"];

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f00";

  const maskSize = 300;

  const tracker = new window.tracking.ObjectTracker(["face"]);
  tracker.setInitialScale(4);
  tracker.setStepSize(2);
  tracker.setEdgesDensity(0.1);
  tracker.on("track", function(event) {
    console.log("tracked:", event);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    event.data.forEach(function(rect) {
      ctx.strokeStyle = "#a64ceb";
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      ctx.font = "11px Helvetica";
      ctx.fillStyle = "#fff";
      ctx.fillText("x: " + rect.x + "px", rect.x + rect.width + 5, rect.y + 11);
      ctx.fillText("y: " + rect.y + "px", rect.x + rect.width + 5, rect.y + 22);
    });
  });

  // start tracking
  window.tracking.track("#canvas", tracker);

  if (guiObj["Show region"]) {
    drawSquareMask(
      ctx,
      maskSize,
      guiObj["Region color"],
      guiObj["Region style"]
    );
  }
};
