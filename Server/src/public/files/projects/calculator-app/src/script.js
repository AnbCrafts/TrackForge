function append(val) {
  const display = document.getElementById("display");
  if (display.innerText === "0") {
    display.innerText = val;
  } else {
    display.innerText += val;
  }
}
function clearDisplay() {
  document.getElementById("display").innerText = "0";
}
function calculate() {
  const display = document.getElementById("display");
  try {
    display.innerText = eval(display.innerText);
  } catch (e) {
    display.innerText = "Error";
  }
}