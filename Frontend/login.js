"use strict";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const toggleIcon = document.querySelector(".toggle-password");
const patientBtn = document.getElementById("login-patient-btn");
const staffBtn = document.getElementById("login-staff-btn");
const rememberCheckbox = document.getElementById("remember-me");

const saveUserData = (user) => {
  localStorage.setItem(
    "userData",
    JSON.stringify({
      ...user,
      isLoggedIn: user.isLoggedIn || false,
      rememberMe: user.rememberMe || false,
    })
  );
};

const getUserData = () => {
  return (
    JSON.parse(localStorage.getItem("userData")) || {
      email: "",
      password: "",
      role: "",
      isLoggedIn: false,
      rememberMe: false,
    }
  );
};

const showError = (input, message) => {
  let span;
  if (input.parentElement.classList.contains("password-wrapper")) {
    span = input.parentElement.parentElement.querySelector(".status");
  }
  if (!span) {
    span = document.createElement("span");
    span.className = "status";
    input.parentElement.parentElement.appendChild(span);
  }
  span.textContent = message;
  span.style.color = "red";
};

const clearErrors = () => {
  document.querySelectorAll(".status").forEach((s) => {
    s.textContent = "";
    s.removeAttribute("style");
  });
};

toggleIcon.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.src =
      "./public/asset/image/visibility_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
    toggleIcon.alt = "visible";
  } else {
    passwordInput.type = "password";
    toggleIcon.src =
      "./public/asset/image/visibility_off_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
    toggleIcon.alt = "hidden";
  }
});

let userData = getUserData();
if (userData) {
  if (userData.isLoggedIn && userData.rememberMe) {
    window.location.href =
      userData.role === "patient"
        ? "patient-dashboard.html"
        : "staff-dashboard.html";
  } else if (userData.rememberMe) {
    emailInput.value = userData.email;
    passwordInput.value = userData.password;
    rememberCheckbox.checked = true;
  }
}

const isValidEmailOrPhone = (value) => {
  const at = value.indexOf("@");
  const dot = value.lastIndexOf(".");
  const validEmail = at > 0 && dot > at + 1 && dot < value.length - 1;

  const validPhone =
    value.length >= 10 &&
    value.length <= 15 &&
    [...value].every((ch) => ch >= "0" && ch <= "9");

  return validEmail || validPhone;
};

const validateForm = () => {
  clearErrors();
  let valid = true;
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email) {
    showError(emailInput, "Email or phone number is required");
    valid = false;
  } else if (!isValidEmailOrPhone(email)) {
    showError(emailInput, "Enter a valid email or phone number");
    valid = false;
  }

  if (!password) {
    showError(passwordInput, "Password is required");
    valid = false;
  } else if (password.length < 6) {
    showError(passwordInput, "Password must be at least 6 characters");
    valid = false;
  }

  return valid;
};

const handleLogin = (expectedRole) => {
  if (!validateForm()) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  userData = getUserData();

  if (
    !userData.email ||
    email !== userData.email ||
    password !== userData.password
  ) {
    showError(emailInput, "Incorrect email or password");
    showError(passwordInput, "Incorrect email or password");
    return;
  }

  if (userData.role !== expectedRole) {
    showError(
      emailInput,
      `This account is not registered as a ${expectedRole}`
    );
    showError(
      passwordInput,
      `This account is not registered as a ${expectedRole}`
    );
    return;
  }

  userData.isLoggedIn = true;
  userData.rememberMe = rememberCheckbox.checked;
  saveUserData(userData);

  window.location.href =
    expectedRole === "patient"
      ? "patient-dashboard.html"
      : "staff-dashboard.html";
};

patientBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleLogin("patient");
});

staffBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleLogin("staff");
});
