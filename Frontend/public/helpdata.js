"use strict";
function saveUsersData(users) {
  localStorage.setItem("allUsers", JSON.stringify(users));
}

function getUsersData() {
  return JSON.parse(localStorage.getItem("allUsers")) || [];
}

function saveSession(session) {
  localStorage.setItem("session", JSON.stringify(session));
}

function getSession() {
  return JSON.parse(localStorage.getItem("session")) || null;
}

function showError(input, message) {
  // let span = input.nextElementSibling;
  // if (!span || !span.classList.contains("status")) {
  //   span = document.createElement("span");
  //   span.className = "status";
  //   input.insertAdjacentElement("afterend", span);
  // }
  const group = input.closest(".input-group, .lgn");
  let span = group.querySelector(".status");
  if (!span) {
    span = document.createElement("span");
    span.className = "status";
    group.appendChild(span);
  }
  span.textContent = message;
  span.style.color = "red";
}

function clearError(input) {
  const group = input.closest(".input-group, .lgn");
  const span = group?.querySelector(".status");
  if (span) {
    span.textContent = "";
    span.removeAttribute("style");
  }
}

function clearErrors(form) {
  const spans = form.querySelectorAll(".status");
  spans.forEach((s) => {
    s.textContent = "";
    s.removeAttribute("style");
  });
}

function togglePassword(input, icon) {
  if (input.type === "password") {
    input.type = "text";
    icon.src =
      "asset/image/visibility_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
    icon.alt = "visible";
  } else {
    input.type = "password";
    icon.src =
      "asset/image/visibility_off_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
    icon.alt = "invisible";
  }
}

function strongPassword(password) {
  if (password.length < 8) return false;
  let hasLower = false;
  let hasUpper = false;
  let hasNumber = false;
  let hasSpecial = false;
  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    if (char >= "a" && char <= "z") hasLower = true;
    else if (char >= "A" && char <= "Z") hasUpper = true;
    else if (char >= "0" && char <= "9") hasNumber = true;
    else hasSpecial = true;
  }
  return hasLower && hasUpper && hasNumber && hasSpecial;
}

function isValidEmail(email) {
  email = email.trim();
  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");
  if (atIndex < 1) return false;
  if (dotIndex <= atIndex + 1) return false;
  if (dotIndex === email.length - 1) return false;
  return true;
}

function isValidPhone(phone) {
  phone = phone.trim();

  if (phone.length < 10 || phone.length > 15) {
    return false;
  }
  for (let i = 0; i < phone.length; i++) {
    const char = phone[i];
    if (!(char >= "0" && char <= "9")) {
      return false;
    }
  }
  return true;
}

function isValidEmailOrPhone(value) {
  return isValidEmail(value) || isValidPhone(value);
}
