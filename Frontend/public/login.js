"use strict";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const toggleIcon = document.querySelector(".toggle-password");
const patientBtn = document.getElementById("login-patient-btn");
const staffBtn = document.getElementById("login-staff-btn");
const rememberCheckbox = document.getElementById("remember-me");

const saveUsersData = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

const getUsersData = () => {
  return JSON.parse(localStorage.getItem("users")) || [];
};

const saveSession = (session) => {
  localStorage.setItem("session", JSON.stringify(session));
};

const getSession = () => {
  return JSON.parse(localStorage.getItem("session")) || null;
};

const showError = (input, message) => {
  let span;
  if (input.parentElement.classList.contains("password-wrapper")) {
    span = input.parentElement.parentElement.querySelector(".status");
  } else {
    span = input.parentElement.querySelector(".status");
  }
  if (!span) {
    span = document.createElement("span");
    span.className = "status";
    if (input.parentElement.classList.contains("password-wrapper")) {
      input.parentElement.parentElement.appendChild(span);
    } else {
      input.parentElement.appendChild(span);
    }
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
      "asset/image/visibility_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
    toggleIcon.alt = "visible";
  } else {
    passwordInput.type = "password";
    toggleIcon.src =
      "asset/image/visibility_off_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
    toggleIcon.alt = "hidden";
  }
});

const session = getSession();
if (session && session.isLoggedIn && session.rememberMe) {
  window.location.href =
    session.role === "patient" ? "patient-dashboard.html" : "access.html";
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

  const typedEmail = emailInput.value.trim().toLowerCase();
  const typedPassword = passwordInput.value.trim();
  const users = getUsersData();
  const foundUser = users.find(
    (u) => (u.email || "") === typedEmail && u.password === typedPassword
  );

  if (!foundUser) {
    showError(emailInput, "Incorrect email or password");
    showError(passwordInput, "Incorrect email or password");
    return;
  }

  if (foundUser.role !== expectedRole) {
    showError(emailInput, `This account is not registered as ${expectedRole}`);
    showError(
      passwordInput,
      `This account is not registered as a ${expectedRole}`
    );
    return;
  }

  // if (
  //   !userData.email ||
  //   email !== userData.email ||
  //   password !== userData.password
  // ) {
  //   showError(emailInput, "Incorrect email or password");
  //   showError(passwordInput, "Incorrect email or password");
  //   return;
  // }

  // if (userData.role !== expectedRole) {
  //   showError(
  //     emailInput,
  //     `This account is not registered as a ${expectedRole}`
  //   );
  //   showError(
  //     passwordInput,
  //     `This account is not registered as a ${expectedRole}`
  //   );
  //   return;
  // }

  // userData.isLoggedIn = true;
  // userData.rememberMe = rememberCheckbox.checked;
  // saveUserData(userData);
  const newSession = {
    email: foundUser.email,
    role: foundUser.role,
    isLoggedIn: true,
    rememberMe: rememberCheckbox && rememberCheckbox.checked ? true : false,
  };
  saveSession(newSession);

  window.location.href =
    expectedRole === "patient" ? "patient-dashboard.html" : "access.html";
};

patientBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleLogin("patient");
});

staffBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleLogin("staff");
});
