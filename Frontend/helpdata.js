"use strict";
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
      isLoggedIn: false,
      rememberMe: false,
    }
  );
};

const checkLogin = () => {
  const user = getUserData();
  return user.isLoggedIn === true;
};

const logout = (redirect = "login.html") => {
  const user = getUserData();

  if (!user.rememberMe) {
    user.isLoggedIn = false;
    localStorage.setItem("userData", JSON.stringify(user));
  }

  window.location.href = redirect;
};

const togglePassword = (input, icon) => {
  if (input.type === "password") {
    input.type = "text";
    icon.src =
      "./public/asset/image/visibility_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
    icon.alt = "visible";
  } else {
    input.type = "password";
    icon.src =
      "./public/asset/image/visibility_off_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
    icon.alt = "hidden";
  }
};

const applyUserRules = () => {
  const user = getUserData();

  if (user && user.isLoggedIn && user.rememberMe) {
    if (user.role === "patient") {
      window.location.href = "patient-dashboard.html";
    } else if (user.role === "staff") {
      window.location.href = "staff-dashboard.html";
    }
  }
};

const showError = (input, message) => {
  let span;
  if (input.type === "checkbox") {
    let wrapper = input.closest(".terms") || input.parentElement;
    span = wrapper.querySelector(".status");
    if (!span) {
      span = document.createElement("span");
      span.className = "status";
      wrapper.appendChild(span);
    }
  } else if (input.parentElement.classList.contains("password-wrapper")) {
    span = input.parentElement.parentElement.querySelector(".status");
    if (!span) {
      span = document.createElement("span");
      span.className = "status";
      input.parentElement.parentElement.appendChild(span);
    }
  } else {
    span = input.closest(".input-group")?.querySelector(".status");
    if (!span) {
      span = document.createElement("span");
      span.className = "status";
      input.insertAdjacentElement("afterend", span);
    }
  }
  span.textContent = message;
  span.style.color = "red";
};

const clearErrors = (form) => {
  form.querySelectorAll(".status").forEach((s) => {
    s.textContent = "";
    s.removeAttribute("style");
  });
};
