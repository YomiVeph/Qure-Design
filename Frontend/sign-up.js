"use script";

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
    togglePassword(input, icon);
  });
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const validateForm = (form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(form);

    let valid = true;

    const firstName = form.querySelector("input[name$='-firstname']");
    const lastName = form.querySelector("input[name$='-lastname']");
    const emailInput = form.querySelector("input[type='email']");
    const passwordInput = form.querySelector(
      "input[name$='-password']:not([name$='-confirm_password'])"
    );
    const confirmPasswordInput = form.querySelector(
      "input[name$='-confirm_password']"
    );
    const terms = form.querySelector('input[type="checkbox"]');

    if (!firstName.value.trim()) {
      showError(firstName, "First name is required");
      valid = false;
    }
    if (!lastName.value.trim()) {
      showError(lastName, "Last name is required");
      valid = false;
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, "Email is required");
      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, "Invalid email format");
      valid = false;
    }

    const phoneInput = form.querySelector("input[type='tel']");
    if (!phoneInput.value.trim()) {
      showError(phoneInput, "Phone number is required");
      valid = false;
    }

    const hospitalInput = form.querySelector("input[name='hospital']");
    if (hospitalInput && !hospitalInput.value.trim()) {
      showError(hospitalInput, "Hospital/Clinic name is required");
      valid = false;
    }

    if (!passwordInput.value.trim()) {
      showError(passwordInput, "Password is required");
      valid = false;
    }
    if (passwordInput.value.trim().length < 6) {
      showError(passwordInput, "Password must be at least 6 characters");
      valid = false;
    }
    if (!confirmPasswordInput.value.trim()) {
      showError(confirmPasswordInput, "Confirm your password");
      valid = false;
    }
    if (
      passwordInput.value.trim() &&
      confirmPasswordInput.value.trim() &&
      passwordInput.value !== confirmPasswordInput.value
    ) {
      showError(confirmPasswordInput, "Passwords do not match");
      valid = false;
    }

    if (!terms.checked) {
      showError(terms, "You must agree to terms");
      valid = false;
    }

    if (!valid) return;

    const role =
      form.querySelector('input[name="role"]:checked')?.value || "patient";

    const user = {
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
      role: role,
    };
    saveUserData(user);
    applyUserRules();
    window.location.href = "login.html";
  });
};

validateForm(patientForm);
validateForm(staffForm);

// if (checkLogin()) {
//   applyUserRules();
// }
