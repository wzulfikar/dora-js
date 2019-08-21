const webcamStreamer = image =>
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        facingMode: "user"
      }
    })
    .then(stream => {
      window.stream = stream;
      image.srcObject = stream;
      return new Promise((resolve, reject) => {
        image.onloadedmetadata = () => {
          resolve();
        };
      });
    });

export default webcamStreamer;
