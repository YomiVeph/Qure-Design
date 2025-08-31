"use script";
const inputArea = document.querySelector("#code-area");
const errorMsg = document.querySelector(".error-msg");
const continueBtn = document.querySelector(".continue-btn");
const backBtn = document.querySelector(".back-btn");
const generateCode = "STAFF-2025";

function checkCode() {
  const userInput = inputArea.value.trim();
  if (userInput === generateCode) {
    errorMsg.style.display = "none";
    window.location.href = "staff-dashboard.html";
  } else if (userInput === "") {
    errorMsg.style.display = "block";
    errorMsg.textContent = "Please enter the access code.";
  } else {
    errorMsg.style.display = "block";
    errorMsg.textContent = "Invalid access code. Please try again.";
  }
}
continueBtn.addEventListener("click", checkCode);

continueBtn.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    checkCode();
  }
});

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});
