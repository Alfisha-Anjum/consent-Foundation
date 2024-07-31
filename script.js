// script.js
function changeContent(title, imageUrl, content) {
  console.log("function call");
  document.getElementById("main-title").innerText = title;
  document.getElementById("main-content").innerText = content;
  document.getElementById(
    "healthcare"
  ).style.backgroundImage = `url(${imageUrl})`;
}

document.addEventListener("DOMContentLoaded", () => {
  const expertiseSelect = document.getElementById("expertise");

  expertiseSelect.addEventListener("change", (event) => {
    if (event.target.value === "all") {
      if (event.target.selectedOptions.length === 1) {
        // Select all options if "Select All" is the only selected option
        Array.from(event.target.options).forEach(
          (option) => (option.selected = true)
        );
      } else {
        // Deselect "Select All" if other options are selected
        event.target.options[0].selected = false;
      }
    } else {
      // Deselect "Select All" if other options are selected
      event.target.options[0].selected = false;
    }
  });
});
