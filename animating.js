const face = document.querySelectorAll(".face");
let count = 0;
changeFace();
function changeFace() {
  count++;

  if (count == face.length) {
    count = 0;
  }

  for (let i = 0; i < face.length; i++) {
    face[i].style.display = "none";
  }

  face[count].style.display = "block";

  setTimeout(() => {
    changeFace();
  }, 2000);
}
