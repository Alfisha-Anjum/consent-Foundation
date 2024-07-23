// script.js
function changeContent(title, imageUrl, content) {
  console.log("function call");
  document.getElementById("main-title").innerText = title;
  document.getElementById("main-content").innerText = content;
  document.getElementById(
    "healthcare"
  ).style.backgroundImage = `url(${imageUrl})`;
}
