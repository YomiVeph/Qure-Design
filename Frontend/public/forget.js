"use script";

document
  .getElementById("forget-password-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const emailError = document.getElementById("email-error");

    const isValidEmail = email.includes("@") && email.includes(".");

    if (email === "") {
      emailError.textContent = "Please enter an email address.";
      emailError.style.color = "red";
      return;
    }

    if (!isValidEmail) {
      emailError.textContent = "Please enter a valid email address.";
      emailError.style.color = "red";
      return;
    }

    emailError.textContent = "";
    window.open("confirmation.html", "_blank");
  });
