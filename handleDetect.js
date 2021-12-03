const URL = "https://teachablemachine.withgoogle.com/models/JX4DggNYV/";

let model, webcam, labelContainer, maxPredictions;
const flip = true; // whether to flip the webcam

// Load the image model and setup the webcam

const init = async () => {
  document.querySelector(".content").scrollIntoView();
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  startLoading();

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip

  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  displayTool();
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
};

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  const sorted = prediction.sort((a, b) => b.probability - a.probability);
  document.querySelector(".hasil-result").innerHTML = sorted[0].className;

  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}

const startLoading = () => {
  document.querySelector(".loading").style.display = "flex";
};

const displayTool = () => {
  document.querySelector(".tool").style.display = "flex";
  document.querySelector(".loading").style.display = "none";
};

const stop = async () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  await webcam.stop();
  document.querySelector(".tool").style.display = "none";
  document.querySelector(".loading").style.display = "none";
  setTimeout(() => {
    location.reload();
  }, 500);
};
