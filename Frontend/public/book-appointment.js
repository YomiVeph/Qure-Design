"use strict";

// DOM Elements
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileNavigation = document.getElementById("mobile-navigation");
const mobileCloseButton = document.getElementById("mobile-close-button");
const bookingForm = document.getElementById("booking-form");
const successModal = document.getElementById("success-modal");
const modalClose = document.getElementById("modal-close");
const goToDashboardBtn = document.getElementById("go-to-dashboard");
const joinQueueBtn = document.getElementById("join-queue-btn");

// Form Elements
const serviceDepartmentSelect = document.getElementById("service-department");
const appointmentDateInput = document.getElementById("appointment-date");
const appointmentTimeInput = document.getElementById("appointment-time");
const phoneNumberInput = document.getElementById("phone-number");
const reasonVisitSelect = document.getElementById("reason-visit");
const otherSpecifyTextarea = document.getElementById("other-specify");
const reviewSmsToggle = document.getElementById("review-sms");

// Display Elements
const displayDate = document.getElementById("display-date");
const displayTime = document.getElementById("display-time");
const smsNotification = document.getElementById("sms-notification");

// Modal Elements
const modalDate = document.getElementById("modal-date");
const modalTime = document.getElementById("modal-time");
const modalDepartment = document.getElementById("modal-department");

// Mobile Navigation Toggle
const toggleMobileMenu = () => {
  mobileNavigation.classList.toggle("active");
  document.body.style.overflow = mobileNavigation.classList.contains("active")
    ? "hidden"
    : "auto";
};

const closeMobileMenu = () => {
  mobileNavigation.classList.remove("active");
  document.body.style.overflow = "auto";
};

// Event Listeners for Mobile Navigation
mobileMenuToggle.addEventListener("click", toggleMobileMenu);
mobileCloseButton.addEventListener("click", closeMobileMenu);

// Close mobile menu when clicking on navigation links
document.querySelectorAll(".mobile-nav-link").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    !mobileNavigation.contains(e.target) &&
    !mobileMenuToggle.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

// Set minimum date to today
const today = new Date().toISOString().split("T")[0];
appointmentDateInput.setAttribute("min", today);

// Set default time to current time + 1 hour
const now = new Date();
now.setHours(now.getHours() + 1);
const defaultTime = now.toTimeString().slice(0, 5);
appointmentTimeInput.value = defaultTime;

// Real-time form updates
const updateAppointmentDetails = () => {
  const selectedDate = appointmentDateInput.value;
  const selectedTime = appointmentTimeInput.value;
  const selectedDepartment = serviceDepartmentSelect.value;

  if (selectedDate) {
    const dateObj = new Date(selectedDate);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    displayDate.textContent = formattedDate;
    modalDate.textContent = formattedDate;
  }

  if (selectedTime) {
    const timeObj = new Date(`2000-01-01T${selectedTime}`);
    const formattedTime = timeObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    displayTime.textContent = formattedTime;
    modalTime.textContent = formattedTime;
  }

  if (selectedDepartment) {
    const departmentText =
      serviceDepartmentSelect.options[serviceDepartmentSelect.selectedIndex]
        .text;
    modalDepartment.textContent = departmentText;

    // Update SMS notification
    if (selectedDate && selectedTime) {
      const timeObj = new Date(`2000-01-01T${selectedTime}`);
      const formattedTime = timeObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      smsNotification.textContent = `Your appointment is confirmed at ${formattedTime} on ${displayDate.textContent}`;
    }
  }
};

// Event listeners for real-time updates
appointmentDateInput.addEventListener("change", updateAppointmentDetails);
appointmentTimeInput.addEventListener("change", updateAppointmentDetails);
serviceDepartmentSelect.addEventListener("change", updateAppointmentDetails);

// Form validation
const validateForm = () => {
  let isValid = true;
  const errors = [];

  // Clear previous error states
  clearFormErrors();

  // Validate Service/Department
  if (!serviceDepartmentSelect.value) {
    showFieldError(serviceDepartmentSelect, "Please select a department");
    isValid = false;
    errors.push("Department selection required");
  }

  // Validate Date
  if (!appointmentDateInput.value) {
    showFieldError(appointmentDateInput, "Please select a date");
    isValid = false;
    errors.push("Date selection required");
  } else {
    const selectedDate = new Date(appointmentDateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showFieldError(appointmentDateInput, "Date cannot be in the past");
      isValid = false;
      errors.push("Invalid date");
    }
  }

  // Validate Time
  if (!appointmentTimeInput.value) {
    showFieldError(appointmentTimeInput, "Please select a time");
    isValid = false;
    errors.push("Time selection required");
  }

  // Validate Phone Number
  if (!phoneNumberInput.value.trim()) {
    showFieldError(phoneNumberInput, "Phone number is required");
    isValid = false;
    errors.push("Phone number required");
  } else if (!isValidPhoneNumber(phoneNumberInput.value.trim())) {
    showFieldError(phoneNumberInput, "Please enter a valid phone number");
    isValid = false;
    errors.push("Invalid phone number");
  }

  // Validate Reason for Visit
  if (!reasonVisitSelect.value) {
    showFieldError(reasonVisitSelect, "Please select a reason for visit");
    isValid = false;
    errors.push("Reason for visit required");
  }

  // Validate Other Specify if "Other" is selected
  if (
    reasonVisitSelect.value === "other" &&
    !otherSpecifyTextarea.value.trim()
  ) {
    showFieldError(otherSpecifyTextarea, "Please specify the reason for visit");
    isValid = false;
    errors.push("Other reason specification required");
  }

  return { isValid, errors };
};

// Phone number validation
const isValidPhoneNumber = (phone) => {
  // Basic phone validation - allows various formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
};

// Show field error
const showFieldError = (field, message) => {
  field.style.borderColor = "#dc2626";

  // Create or update error message
  let errorElement = field.parentElement.querySelector(".field-error");
  if (!errorElement) {
    errorElement = document.createElement("span");
    errorElement.className = "field-error";
    errorElement.style.cssText = `
      color: #dc2626;
      font-size: 1.2rem;
      margin-top: 0.4rem;
      display: block;
    `;
    field.parentElement.appendChild(errorElement);
  }
  errorElement.textContent = message;
};

// Clear form errors
const clearFormErrors = () => {
  document.querySelectorAll(".field-error").forEach((error) => error.remove());
  document
    .querySelectorAll(".form-input, .form-select, .form-textarea")
    .forEach((field) => {
      field.style.borderColor = "#d1d5db";
    });
};

// Handle form submission
const handleFormSubmit = (e) => {
  e.preventDefault();

  const validation = validateForm();

  if (!validation.isValid) {
    console.log("Form validation failed:", validation.errors);
    return;
  }

  // Show loading state
  const submitBtn = document.getElementById("book-appointment-btn");
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Booking...";

  // Simulate API call
  setTimeout(() => {
    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    // Show success modal
    showSuccessModal();
  }, 2000);
};

// Show success modal
const showSuccessModal = () => {
  successModal.classList.add("active");
  document.body.style.overflow = "hidden";
};

// Hide success modal
const hideSuccessModal = () => {
  successModal.classList.remove("active");
  document.body.style.overflow = "auto";
};

// Modal event listeners
modalClose.addEventListener("click", hideSuccessModal);
goToDashboardBtn.addEventListener("click", () => {
  hideSuccessModal();
  // Redirect back to Patient Dashboard
  window.location.href = "patient-dashboard.html";
});

// Close modal when clicking outside
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) {
    hideSuccessModal();
  }
});

// Handle Join Queue button
const handleJoinQueue = () => {
  // Validate required fields for queue joining
  if (!serviceDepartmentSelect.value || !reasonVisitSelect.value) {
    alert("Please fill in the required fields before joining the queue");
    return;
  }

  // Show loading state
  const originalText = joinQueueBtn.textContent;
  joinQueueBtn.disabled = true;
  joinQueueBtn.textContent = "Joining...";

  // Simulate API call
  setTimeout(() => {
    joinQueueBtn.disabled = false;
    joinQueueBtn.textContent = originalText;

    // Show success message
    alert(
      "Successfully joined the queue! You will be notified when it's your turn."
    );

    // Optionally redirect to queue tracking page
    // window.location.href = "real-time-queue-tracking.html";
  }, 1500);
};

// Handle reason for visit change
const handleReasonChange = () => {
  const selectedReason = reasonVisitSelect.value;
  const otherSpecifyGroup = otherSpecifyTextarea.parentElement;

  if (selectedReason === "other") {
    otherSpecifyTextarea.required = true;
    otherSpecifyTextarea.style.display = "block";
  } else {
    otherSpecifyTextarea.required = false;
    otherSpecifyTextarea.style.display = "none";
    otherSpecifyTextarea.value = "";
  }
};

// Event listeners
bookingForm.addEventListener("submit", handleFormSubmit);
joinQueueBtn.addEventListener("click", handleJoinQueue);
reasonVisitSelect.addEventListener("change", handleReasonChange);

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Book Appointment page loaded successfully");

  // Set initial values
  updateAppointmentDetails();

  // Set default time to current time + 1 hour
  const now = new Date();
  now.setHours(now.getHours() + 1);
  const defaultTime = now.toTimeString().slice(0, 5);
  appointmentTimeInput.value = defaultTime;

  // Update display immediately
  updateAppointmentDetails();

  // Add some sample data for demonstration
  if (!serviceDepartmentSelect.value) {
    serviceDepartmentSelect.value = "cardiology";
    updateAppointmentDetails();
  }
});

// Handle window resize for responsive behavior
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});

// Enhanced form interactions
const enhanceFormInteractions = () => {
  // Add focus effects
  document
    .querySelectorAll(".form-input, .form-select, .form-textarea")
    .forEach((field) => {
      field.addEventListener("focus", () => {
        field.parentElement.style.transform = "translateY(-2px)";
        field.parentElement.style.transition = "transform 0.3s ease";
      });

      field.addEventListener("blur", () => {
        field.parentElement.style.transform = "translateY(0)";
      });
    });

  // Add character counter for textarea
  otherSpecifyTextarea.addEventListener("input", () => {
    const maxLength = 500;
    const currentLength = otherSpecifyTextarea.value.length;

    let counter =
      otherSpecifyTextarea.parentElement.querySelector(".char-counter");
    if (!counter) {
      counter = document.createElement("span");
      counter.className = "char-counter";
      counter.style.cssText = `
        font-size: 1.2rem;
        color: #64748b;
        text-align: right;
        margin-top: 0.4rem;
      `;
      otherSpecifyTextarea.parentElement.appendChild(counter);
    }

    counter.textContent = `${currentLength}/${maxLength}`;

    if (currentLength > maxLength * 0.9) {
      counter.style.color = "#dc2626";
    } else {
      counter.style.color = "#64748b";
    }
  });
};

// Initialize enhanced interactions
document.addEventListener("DOMContentLoaded", enhanceFormInteractions);

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add form auto-save functionality (for better UX)
let autoSaveTimeout;
const autoSaveForm = () => {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    const formData = {
      serviceDepartment: serviceDepartmentSelect.value,
      appointmentDate: appointmentDateInput.value,
      appointmentTime: appointmentTimeInput.value,
      phoneNumber: phoneNumberInput.value,
      reasonVisit: reasonVisitSelect.value,
      otherSpecify: otherSpecifyTextarea.value,
    };

    localStorage.setItem("appointmentFormDraft", JSON.stringify(formData));
    console.log("Form auto-saved");
  }, 1000);
};

// Add auto-save listeners
document
  .querySelectorAll(".form-input, .form-select, .form-textarea")
  .forEach((field) => {
    field.addEventListener("input", autoSaveForm);
    field.addEventListener("change", autoSaveForm);
  });

// Restore form data on page load
const restoreFormData = () => {
  const savedData = localStorage.getItem("appointmentFormDraft");
  if (savedData) {
    try {
      const data = JSON.parse(savedData);

      if (data.serviceDepartment)
        serviceDepartmentSelect.value = data.serviceDepartment;
      if (data.appointmentDate)
        appointmentDateInput.value = data.appointmentDate;
      if (data.appointmentTime)
        appointmentTimeInput.value = data.appointmentTime;
      if (data.phoneNumber) phoneNumberInput.value = data.phoneNumber;
      if (data.reasonVisit) reasonVisitSelect.value = data.reasonVisit;
      if (data.otherSpecify) otherSpecifyTextarea.value = data.otherSpecify;

      updateAppointmentDetails();
      handleReasonChange();

      console.log("Form data restored from auto-save");
    } catch (error) {
      console.error("Error restoring form data:", error);
    }
  }
};

// Restore form data when page loads
document.addEventListener("DOMContentLoaded", restoreFormData);
