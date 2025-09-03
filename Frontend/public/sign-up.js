"use strict";

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
    clearErrors(form);
    let valid = true;
    const firstName = form.querySelector('input[name$="-firstname"]');
    const lastName = form.querySelector('input[name$="-lastname"]');
    const email = form.querySelector("input[type='email']");
    const phoneInput = form.querySelector("input[type='tel']");
    const password = form.querySelector("input[name$='-password']");
    const confirmPassword = form.querySelector(
      "input[name$='-confirm_password']"
    );
    const terms = form.querySelector("input[type='checkbox']");
    const hospitalInput = form.querySelector("input[name='hospital']");

    if (!firstName.value.trim()) {
      showError(firstName, "First name is required.");
      valid = false;
    }
    if (!lastName.value.trim()) {
      showError(lastName, "Last name is required.");
      valid = false;
    }
    if (!email.value.trim()) {
      showError(email, "Valid email is required.");
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, "Email format is invalid.");
      valid = false;
    }
    if (!phoneInput.value.trim()) {
      showError(phoneInput, "Phone number is required.");
      valid = false;
    } else if (!isValidPhone(phoneInput.value.trim())) {
      showError(phoneInput, "Phone number must be 10 digits.");
      valid = false;
    }
    if (hospitalInput && !hospitalInput.value.trim()) {
      showError(hospitalInput, "Hospital/Clinic name is required.");
      valid = false;
    }
    if (!password.value.trim()) {
      showError(password, "Password is required.");
      valid = false;
    } else if (!strongPassword(password.value.trim())) {
      showError(
        password,
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      valid = false;
    }
    if (!confirmPassword.value.trim()) {
      showError(confirmPassword, "Please confirm your password.");
      valid = false;
    } else if (password.value.trim() !== confirmPassword.value.trim()) {
      showError(confirmPassword, "Passwords do not match.");
      valid = false;
    }
    if (!terms.checked) {
      showError(terms, "You must agree to the terms and conditions.");
      valid = false;
    }
    if (!valid) return;

    const users = getUsersData();
    const emailExists = users.some(
      (user) => user.email?.toLowerCase() === email.value.trim().toLowerCase()
    );
    const phoneExists = users.some(
      (user) => user.phone === phoneInput.value.trim()
    );

    if (emailExists) {
      showError(emailInput, "Email is already registered.");
      return;
    }
    if (phoneExists) {
      showError(phoneInput, "Phone number is already registered.");
      return;
    }
    const role = form.id === "form-patient" ? "patient" : "staff";
    const newUser = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      phone: phoneInput.value.trim(),
      password: password.value.trim(),
      hospital: hospitalInput ? hospitalInput.value.trim() : null,
      role: role,
    };
    users.push(newUser);
    saveUsersData(users);
    window.location.href = "login.html";
  });
}
validateForm(patientForm);
validateForm(staffForm);
