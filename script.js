const video = document.getElementById("video");
getResult();

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
      getResult(detections);
    }, 500);
  });

  document.querySelector(".btn-stop").addEventListener("click", stopVideo);
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

function getResult(result = []) {
  const detailContainer = document.getElementById("detail-container");
  if (result.length > 0) {
    const dataDetect = result[0].expressions;
    const sorted = [];

    for (const data in dataDetect) {
      sorted.push({
        label: data,
        value: dataDetect[data],
      });
    }

    sorted.sort((a, b) => b.value - a.value);

    document.querySelector(".hasil-result").innerHTML = sorted[0].label;
    detailContainer.innerHTML = appendDetail(sorted);
  }
}

const appendDetail = (arr = []) => {
  let detail = ``;
  for (let index = 0; index < arr.length - 1; index++) {
    detail += `${arr[index].label} ( ${Number(arr[index].value).toFixed(
      2
    )} ) <br>`;
  }
  return detail;
};

const displayTool = () => {
  document.querySelector(".tool").style.display = "flex";
  document.querySelector(".loading").style.display = "none";
};

const stopVideo = () => {
  const mediaStream = video.srcObject;
  const tracks = mediaStream.getTracks();
  tracks[0].stop();
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  document.querySelector(".tool").style.display = "none";
  document.querySelector(".loading").style.display = "none";
};
