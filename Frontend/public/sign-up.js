"use strict";

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

const patientForm = document.getElementById("form-patient");
const staffForm = document.querySelector("#form-staff");
const toggleIcons = document.querySelectorAll(".toggle-password");
const roleRadios = document.querySelectorAll('input[name="role"]');

patientForm.classList.remove("hidden");
staffForm.classList.add("hidden");

roleRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    if (e.target.value === "patient") {
      patientForm.classList.remove("hidden");
      staffForm.classList.add("hidden");
    } else {
      patientForm.classList.add("hidden");
      staffForm.classList.remove("hidden");
    }
  });
});

toggleIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const input = icon.previousElementSibling;
    togglePassword(input, icon);
  });
});

function validateForm(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Relaxed: bypass all validation and backend for now
    window.location.href = "login.html";
  });
}
validateForm(patientForm);
validateForm(staffForm);
