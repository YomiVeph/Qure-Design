"use strict";
const patientForm = document.getElementById("form-patient");
const staffForm = document.getElementById("form-staff");
const roleRadios = document.querySelectorAll('input[name="role"]');
const toggleIcons = document.querySelectorAll(".toggle-password");

patientForm.classList.remove("hidden");
staffForm.classList.add("hidden");

roleRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    if (e.target.value === "patient") {
      patientForm.classList.remove("hidden");
      staffForm.classList.add("hidden");
    } else {
      staffForm.classList.remove("hidden");
      patientForm.classList.add("hidden");
    }
  });
});

toggleIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const input = icon.previousElementSibling;

    if (input.type === "password") {
      input.type = "text";
      icon.src =
        "./asset/image/visibility_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
      icon.alt = "visibility_on";
    } else {
      input.type = "password";
      icon.src =
        "./asset/image/visibility_off_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
      icon.alt = "visibility_off";
    }
  });
});
