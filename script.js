const video = document.getElementById("video");

function init() {
  document.querySelector(".content").scrollIntoView();
  startLoading();
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  ]).then(startVideo);
  video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 500);
  });
}

function startVideo() {
  displayTool();
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

const startLoading = () => {
  document.querySelector(".loading").style.display = "flex";
};

const displayTool = () => {
  document.querySelector(".tool").style.display = "flex";
  document.querySelector(".loading").style.display = "none";
};
