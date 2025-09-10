"use strict";
const inputArea = document.querySelector("#code-area");
const errorMsg = document.querySelector(".error-msg");
const continueBtn = document.querySelector(".continue-btn");
const backBtn = document.querySelector(".back-btn");

// Validation temporarily disabled; backend wiring will be added later

let sideBarOpen = false;
const sidebar = document.getElementById("sidebar");
function openSideBar() {
  if (!sideBarOpen) {
    sidebar.classList.add("sidebar-responsive");
    sideBarOpen = true;
  }
}

function closeSideBar() {
  if (sideBarOpen) {
    sidebar.classList.remove("sidebar-responsive");
    sideBarOpen = false;
  }
}

function checkCode() {
  window.location.href = "hospital-dashboard.html";
}
continueBtn.addEventListener("click", (e) => {
  e.preventDefault();
  checkCode();
});

continueBtn.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    checkCode();
  }
});

backBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "index.html";
});
