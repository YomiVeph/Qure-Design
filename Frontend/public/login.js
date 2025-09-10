"use strict";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const toggleIcon = document.querySelector(".toggle-password");
const patientBtn = document.getElementById("login-patient-btn");
const staffBtn = document.getElementById("login-staff-btn");
const rememberCheckbox = document.getElementById("remember-me");

// --- Local helpers (replacing removed shared helpers) ---
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

function showError(input, message) {
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

function clearErrors(form) {
  const spans = form.querySelectorAll(".status");
  spans.forEach((s) => {
    s.textContent = "";
    s.removeAttribute("style");
  });
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
  if (phone.length < 10 || phone.length > 15) return false;
  for (let i = 0; i < phone.length; i++) {
    const char = phone[i];
    if (!(char >= "0" && char <= "9")) return false;
  }
  return true;
}

function isValidEmailOrPhone(value) {
  return isValidEmail(value) || isValidPhone(value);
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

toggleIcon.addEventListener("click", () => {
  togglePassword(passwordInput, toggleIcon);
});

function validateForm() {
  clearErrors(loginForm);
  let valid = true;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email) {
    showError(emailInput, "Email or phone is required");
    valid = false;
  } else if (!isValidEmailOrPhone(email)) {
    showError(emailInput, "Enter a valid email or phone");
    valid = false;
  }

  if (!password) {
    showError(passwordInput, "Password is required");
    valid = false;
  } else if (!strongPassword(password)) {
    showError(
      passwordInput,
      "Password must have upper, lower, number & symbol"
    );
    valid = false;
  }

  return valid;
}

function handleLogin(expectedRole) {
  // Relaxed: skip validation and backend for now, just navigate
  if (expectedRole === "patient") {
    window.location.href = "patient-dashboard.html";
  } else {
    window.location.href = "access.html";
  }
}

patientBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleLogin("patient");
});

staffBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleLogin("staff");
});
