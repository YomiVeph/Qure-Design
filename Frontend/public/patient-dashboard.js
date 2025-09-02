"use strict";

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
  // Show confirmation dialog
  if (confirm("Are you sure you want to cancel your queue position?")) {
    // In a real application, this would make an API call to cancel the queue
    alert("Queue cancelled successfully!");

    // Update the UI to show "Not in queue" state
    const queueStatusCard = document.querySelector(".queue-status-card");
    queueStatusCard.innerHTML = `
      <h3 class="queue-title">You are not in a queue</h3>
      <div class="queue-info">
        <span class="queue-number" style="color: #64748b;">-</span>
        <span class="queue-eta">No active queue</span>
      </div>
      <div class="queue-actions">
        <button class="btn btn-primary" id="join-queue-btn">JOIN QUEUE</button>
      </div>
    `;

    // Add event listener to the new join queue button
    document
      .getElementById("join-queue-btn")
      .addEventListener("click", handleJoinQueue);
  }
};

const handleJoinQueue = () => {
  // In a real application, this would make an API call to join a queue
  alert("Joining queue...");

  // Simulate joining a queue after a short delay
  setTimeout(() => {
    const queueStatusCard = document.querySelector(".queue-status-card");
    queueStatusCard.innerHTML = `
      <h3 class="queue-title">You are in a queue</h3>
      <div class="queue-info">
        <span class="queue-number">C-012</span>
        <span class="queue-eta">ETA: 4 mins</span>
      </div>
      <div class="queue-actions">
        <button class="btn btn-primary" id="view-queue-btn">VIEW QUEUE</button>
        <button class="btn btn-secondary" id="cancel-queue-btn">CANCEL</button>
      </div>
    `;

    // Re-add event listeners
    document
      .getElementById("view-queue-btn")
      .addEventListener("click", handleViewQueue);
    document
      .getElementById("cancel-queue-btn")
      .addEventListener("click", handleCancelQueue);
  }, 1000);
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
  // In a real application, this would open a rescheduling modal or redirect
  alert("Opening rescheduling options...");
};

const handleCancelAppointment = (appointmentCard) => {
  if (confirm("Are you sure you want to cancel this appointment?")) {
    // In a real application, this would make an API call to cancel the appointment
    alert("Appointment cancelled successfully!");

    // Remove the appointment card from the UI
    appointmentCard.remove();

    // Check if there are no more appointments
    const appointmentsList = document.querySelector(".appointments-list");
    if (appointmentsList.children.length === 0) {
      appointmentsList.innerHTML = `
        <div class="empty-appointments">
          <p>No upcoming appointments</p>
        </div>
      `;
    }
  }
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
`;
document.head.appendChild(style);

// Feedback Link Handler
document.addEventListener("DOMContentLoaded", () => {
  const feedbackLink = document.querySelector(".feedback-link");

  if (feedbackLink) {
    feedbackLink.addEventListener("click", (e) => {
      e.preventDefault();

      // In a real application, this would open a feedback form or redirect
      alert("Opening feedback form...");
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
        alert("Failed to copy text to clipboard");
      }
    });
  }
});

// Auto-refresh queue ETA (simulate real-time updates)
let queueETACounter = 4; // Starting with 4 minutes

const updateQueueETA = () => {
  if (queueETACounter > 0) {
    queueETACounter--;
    const etaElement = document.querySelector(".queue-eta");
    if (etaElement) {
      etaElement.textContent = `ETA: ${queueETACounter} min${
        queueETACounter !== 1 ? "s" : ""
      }`;
    }

    // If ETA reaches 0, show "Now serving" or similar
    if (queueETACounter === 0) {
      const etaElement = document.querySelector(".queue-eta");
      if (etaElement) {
        etaElement.textContent = "Now serving!";
        etaElement.style.color = "#10b981";
        etaElement.style.fontWeight = "600";
      }
    }
  }
};

// Update ETA every minute (60000ms)
setInterval(updateQueueETA, 60000);

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Patient Dashboard loaded successfully");

  // TEMPORARILY DISABLED FOR DEVELOPMENT
  /*
  // Check if user is logged in (basic check)
  const userData = localStorage.getItem("userData");
  if (!userData) {
    // Redirect to login if not authenticated
    window.location.href = "../login.html";
    return;
  }
  
  // Parse user data
  try {
    const user = JSON.parse(userData);
    if (user.role !== "patient") {
      // Redirect if not a patient
      window.location.href = "../login.html";
      return;
    }
    
    // Update greeting with actual user name if available
    if (user.firstName) {
      const greeting = document.querySelector(".greeting");
      if (greeting) {
        greeting.textContent = `Hi, ${user.firstName}`;
      }
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    window.location.href = "../login.html";
  }
  */

  // DEVELOPMENT MODE: Use default user data
  console.log("Running in development mode - authentication check disabled");

  // You can still test with mock user data if needed
  const mockUser = {
    firstName: "Joan",
    email: "joan@example.com",
    role: "patient",
  };

  // Update greeting with mock user name
  const greeting = document.querySelector(".greeting");
  if (greeting) {
    greeting.textContent = `Hi, ${mockUser.firstName}`;
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
