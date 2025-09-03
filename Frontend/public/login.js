"use strict";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const toggleIcon = document.querySelector(".toggle-password");
const patientBtn = document.getElementById("login-patient-btn");
const staffBtn = document.getElementById("login-staff-btn");
const rememberCheckbox = document.getElementById("remember-me");

toggleIcon.addEventListener("click", () => {
  togglePassword(passwordInput, toggleIcon);
});

const session = getSession();
if (session && session.isLoggedIn && session.rememberMe) {
  if (session.email) emailInput.value = session.email;
  else if (session.phone) emailInput.value = session.phone;
  rememberCheckbox.checked = true;
}

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
  if (!validateForm()) return;

  const typedId = emailInput.value.trim().toLowerCase();
  const typedPassword = passwordInput.value.trim();
  const users = getUsersData();

  const foundUser = users.find(
    (u) =>
      (u.email?.toLowerCase() === typedId || u.phone === typedId) &&
      u.password === typedPassword
  );

  if (!foundUser) {
    showError(emailInput, "Wrong email/phone or password");
    showError(passwordInput, "Wrong email/phone or password");
    return;
  }

  if (foundUser.role !== expectedRole) {
    showError(emailInput, `Not registered as ${expectedRole}`);
    return;
  }

  const newSession = {
    email: foundUser.email || null,
    phone: foundUser.phone || null,
    role: foundUser.role,
    isLoggedIn: true,
    rememberMe: rememberCheckbox.checked,
  };
  saveSession(newSession);

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
