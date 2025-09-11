"use strict";

// Custom Popup Function
function showCustomPopup(title, message, type = "info") {
  // Remove any existing popup
  const existingPopup = document.querySelector(".custom-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create popup overlay
  const overlay = document.createElement("div");
  overlay.className = "custom-popup-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;

  // Create popup content
  const popup = document.createElement("div");
  popup.className = "custom-popup";

  // Set colors based on type
  let iconColor, bgColor, borderColor;
  switch (type) {
    case "error":
      iconColor = "#ef4444";
      bgColor = "#fef2f2";
      borderColor = "#fecaca";
      break;
    case "success":
      iconColor = "#10b981";
      bgColor = "#f0fdf4";
      borderColor = "#bbf7d0";
      break;
    case "warning":
      iconColor = "#f59e0b";
      bgColor = "#fffbeb";
      borderColor = "#fed7aa";
      break;
    default: // info
      iconColor = "#3b82f6";
      bgColor = "#eff6ff";
      borderColor = "#bfdbfe";
  }

  popup.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 2px solid ${borderColor};
    animation: slideIn 0.3s ease;
    position: relative;
  `;

  // Create icon
  const icon = document.createElement("div");
  icon.style.cssText = `
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: ${bgColor};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    border: 2px solid ${borderColor};
  `;

  const iconSymbol = document.createElement("span");
  iconSymbol.style.cssText = `
    font-size: 24px;
    color: ${iconColor};
    font-weight: bold;
  `;

  // Set icon based on type
  switch (type) {
    case "error":
      iconSymbol.textContent = "!";
      break;
    case "success":
      iconSymbol.textContent = "✓";
      break;
    case "warning":
      iconSymbol.textContent = "⚠";
      break;
    default:
      iconSymbol.textContent = "i";
  }

  icon.appendChild(iconSymbol);

  // Create title
  const titleEl = document.createElement("h3");
  titleEl.textContent = title;
  titleEl.style.cssText = `
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
    text-align: center;
  `;

  // Create message
  const messageEl = document.createElement("p");
  messageEl.textContent = message;
  messageEl.style.cssText = `
    color: #6b7280;
    margin: 0 0 1.5rem 0;
    text-align: center;
    line-height: 1.5;
  `;

  // Create close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "OK";
  closeBtn.style.cssText = `
    background-color: ${iconColor};
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
    transition: all 0.2s ease;
  `;

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.opacity = "0.9";
    closeBtn.style.transform = "translateY(-1px)";
  });

  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.opacity = "1";
    closeBtn.style.transform = "translateY(0)";
  });

  closeBtn.addEventListener("click", () => {
    overlay.remove();
  });

  // Assemble popup
  popup.appendChild(icon);
  popup.appendChild(titleEl);
  popup.appendChild(messageEl);
  popup.appendChild(closeBtn);
  overlay.appendChild(popup);

  // Add to document
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      overlay.remove();
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);
}

// DOM Elements
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileNavigation = document.getElementById("mobile-navigation");
const mobileCloseButton = document.getElementById("mobile-close-button");
const viewQueueBtn = document.getElementById("view-queue-btn");
const cancelQueueBtn = document.getElementById("cancel-queue-btn");
const joinQueueBtn = document.getElementById("join-queue-btn");
const bookAppointmentBtn = document.getElementById("book-appointment-btn");

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

// Queue Management Functions
const handleViewQueue = () => {
  // Redirect to the real-time queue tracking page
  window.location.href = "real-time-queue-tracking.html";
};

const handleCancelQueue = () => {
  // Backend integration required
  showCustomPopup(
    "Cancel Queue",
    "Cancel queue functionality is not connected yet. Backend integration pending.",
    "info"
  );
};

const handleJoinQueue = () => {
  // Backend integration required
  showCustomPopup(
    "Join Queue",
    "Join queue functionality is not connected yet. Backend integration pending.",
    "info"
  );
};

const handleBookAppointment = () => {
  // Redirect to the Book Appointment page
  window.location.href = "book-appointment.html";
};

// Event Listeners for Action Buttons
viewQueueBtn.addEventListener("click", handleViewQueue);
cancelQueueBtn.addEventListener("click", handleCancelQueue);
joinQueueBtn.addEventListener("click", handleJoinQueue);
bookAppointmentBtn.addEventListener("click", handleBookAppointment);

// Appointment Management Functions
const handleReschedule = (appointmentCard) => {
  showCustomPopup(
    "Reschedule Appointment",
    "Reschedule functionality is not connected yet. Backend integration pending.",
    "info"
  );
};

const handleCancelAppointment = (appointmentCard) => {
  showCustomPopup(
    "Cancel Appointment",
    "Cancel appointment functionality is not connected yet. Backend integration pending.",
    "info"
  );
};

// Add event listeners to appointment action buttons
document.addEventListener("DOMContentLoaded", () => {
  const rescheduleButtons = document.querySelectorAll(
    ".action-link.reschedule"
  );
  const cancelButtons = document.querySelectorAll(".action-link.cancel");

  rescheduleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const appointmentCard = button.closest(".appointment-card");
      handleReschedule(appointmentCard);
    });
  });

  cancelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const appointmentCard = button.closest(".appointment-card");
      handleCancelAppointment(appointmentCard);
    });
  });
});

// Toggle Switch Functionality
document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitches = document.querySelectorAll(".toggle-switch input");

  toggleSwitches.forEach((toggle) => {
    toggle.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      const notificationType = e.target
        .closest(".notification-option")
        .querySelector("span").textContent;

      // In a real application, this would make an API call to update notification preferences
      console.log(
        `${notificationType} notifications ${
          isChecked ? "enabled" : "disabled"
        }`
      );

      // Show feedback to user
      const feedback = document.createElement("div");
      feedback.className = "toggle-feedback";
      feedback.textContent = `${notificationType} notifications ${
        isChecked ? "enabled" : "disabled"
      }`;
      feedback.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background-color: ${isChecked ? "#10b981" : "#6b7280"};
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        font-size: 1.4rem;
        z-index: 1001;
        animation: slideIn 0.3s ease;
      `;

      document.body.appendChild(feedback);

      // Remove feedback after 3 seconds
      setTimeout(() => {
        feedback.remove();
      }, 3000);
    });
  });
});

// Add CSS animation for feedback
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes popupSlideIn {
    from {
      transform: translateY(-20px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
  
  .custom-popup {
    animation: popupSlideIn 0.3s ease !important;
  }
`;
document.head.appendChild(style);

// Feedback Link Handler
document.addEventListener("DOMContentLoaded", () => {
  const feedbackLink = document.querySelector(".feedback-link");

  if (feedbackLink) {
    feedbackLink.addEventListener("click", (e) => {
      e.preventDefault();

      // In a real application, this would open a feedback form or redirect
      showCustomPopup("Feedback", "Opening feedback form...", "info");
      // window.location.href = "feedback.html";
    });
  }
});

// SMS Instruction Copy Functionality
document.addEventListener("DOMContentLoaded", () => {
  const smsInstruction = document.querySelector(".sms-instruction");

  if (smsInstruction) {
    smsInstruction.style.cursor = "pointer";
    smsInstruction.title = "Click to copy";

    smsInstruction.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("JOIN 3001");
        smsInstruction.style.backgroundColor = "#10b981";
        smsInstruction.style.color = "white";
        smsInstruction.textContent = "Copied!";

        setTimeout(() => {
          smsInstruction.style.backgroundColor = "#f1f5f9";
          smsInstruction.style.color = "#1e293b";
          smsInstruction.textContent = 'Text "JOIN 3001" to 50050';
        }, 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
        showCustomPopup(
          "Copy Failed",
          "Failed to copy text to clipboard",
          "error"
        );
      }
    });
  }
});

// Removed simulated ETA updates; will be driven by backend events.

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Patient Dashboard loaded successfully");

  // Check if user is logged in
  const userData = localStorage.getItem("userData");
  const authToken = localStorage.getItem("authToken");

  if (!userData || !authToken) {
    // Redirect to login if not authenticated
    window.location.href = "login.html";
    return;
  }

  // Parse user data
  try {
    const user = JSON.parse(userData);
    if (user.role !== "patient") {
      // Redirect if not a patient
      window.location.href = "login.html";
      return;
    }

    // Update greeting with actual user name
    if (user.firstName) {
      const greeting = document.querySelector(".greeting");
      if (greeting) {
        greeting.textContent = `Hi, ${user.firstName}`;
      }
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    window.location.href = "login.html";
  }
});

// Logout functionality
function handleLogout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  window.location.href = "login.html";
}

// Add logout to user profile icon
document.addEventListener("DOMContentLoaded", () => {
  const userProfile = document.querySelector(".user-profile");
  if (userProfile) {
    userProfile.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to logout?")) {
        handleLogout();
      }
    });
  }
});

// Handle window resize for responsive behavior
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});

// Add loading states for better UX
const addLoadingState = (button) => {
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Loading...";
  button.style.opacity = "0.7";

  return () => {
    button.disabled = false;
    button.textContent = originalText;
    button.style.opacity = "1";
  };
};

// Enhanced button handlers with loading states
const enhancedHandleViewQueue = () => {
  const removeLoading = addLoadingState(viewQueueBtn);

  setTimeout(() => {
    removeLoading();
    handleViewQueue();
  }, 1000);
};

const enhancedHandleJoinQueue = () => {
  const removeLoading = addLoadingState(joinQueueBtn);

  setTimeout(() => {
    removeLoading();
    handleJoinQueue();
  }, 1000);
};

// Replace original handlers with enhanced ones
viewQueueBtn.removeEventListener("click", handleViewQueue);
joinQueueBtn.removeEventListener("click", handleJoinQueue);
viewQueueBtn.addEventListener("click", enhancedHandleViewQueue);
joinQueueBtn.addEventListener("click", enhancedHandleJoinQueue);
