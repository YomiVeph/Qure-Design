"use strict";

// DOM Elements
const queueTableBody = document.getElementById("queue-table-body");
const updateTimeElement = document.getElementById("update-time");
const refreshButton = document.getElementById("refresh-button");
const loadingState = document.getElementById("loading-state");
const emptyState = document.getElementById("empty-state");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileNavigation = document.getElementById("mobile-navigation");
const mobileCloseButton = document.getElementById("mobile-close-button");

// Queue data and state management
let queueData = [];
let lastUpdateTime = new Date();
let autoRefreshInterval = null;
let isRefreshing = false;

// Mock queue data - in real app, this would come from an API
const mockQueueData = [
  {
    id: 1,
    patientName: "Richard Oladipo",
    service: "Consultation",
    status: "now-serving",
    estimatedWait: "Now Serving",
  },
  {
    id: 2,
    patientName: "Peter Babarinde",
    service: "Radiology",
    status: "next",
    estimatedWait: "Next",
  },
  {
    id: 3,
    patientName: "Adewale John",
    service: "Dermatology",
    status: "waiting",
    estimatedWait: "25 minutes",
  },
  {
    id: 4,
    patientName: "Obi Fredricks",
    service: "Pediatrics",
    status: "waiting",
    estimatedWait: "50 minutes",
  },
  {
    id: 5,
    patientName: "David Benjamin",
    service: "Consultation",
    status: "waiting",
    estimatedWait: "1hr 15 minutes",
  },
  {
    id: 6,
    patientName: "Olaseni Emmanuel",
    service: "Radiology",
    status: "waiting",
    estimatedWait: "1hr 35 minutes",
  },
];

// Utility functions
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} secs ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  } else {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  }
};

const updateTimeDisplay = () => {
  updateTimeElement.textContent = formatTimeAgo(lastUpdateTime);
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "now-serving":
      return "status-badge status-now-serving";
    case "next":
      return "status-badge status-next";
    case "waiting":
      return "status-badge status-waiting";
    default:
      return "status-badge status-waiting";
  }
};

const createQueueRow = (queueItem) => {
  const row = document.createElement("div");
  row.className = "queue-table-row";
  row.setAttribute("data-patient-id", queueItem.id);

  row.innerHTML = `
    <div class="table-cell">
      <span class="patient-name">${queueItem.patientName}</span>
    </div>
    <div class="table-cell">
      <span class="service-name">${queueItem.service}</span>
    </div>
    <div class="table-cell status-cell">
      <span class="${getStatusBadgeClass(queueItem.status)}">${
    queueItem.estimatedWait
  }</span>
    </div>
  `;

  return row;
};

const renderQueueTable = (data) => {
  queueTableBody.innerHTML = "";

  if (data.length === 0) {
    loadingState.style.display = "none";
    emptyState.style.display = "flex";
    return;
  }

  emptyState.style.display = "none";

  data.forEach((queueItem) => {
    const row = createQueueRow(queueItem);
    queueTableBody.appendChild(row);
  });
};

const showLoadingState = () => {
  loadingState.style.display = "flex";
  emptyState.style.display = "none";
};

const hideLoadingState = () => {
  loadingState.style.display = "none";
};

// Simulate API call for queue data
const fetchQueueData = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In real app, this would be an API call
  // For demo purposes, we'll randomly modify some data to simulate real-time updates
  const updatedData = mockQueueData.map((item) => {
    if (item.status === "waiting") {
      // Randomly update some waiting times
      const randomChange = Math.random() > 0.7;
      if (randomChange) {
        const currentWait = item.estimatedWait;
        if (currentWait.includes("minutes")) {
          const minutes = parseInt(currentWait);
          if (minutes > 5) {
            item.estimatedWait = `${minutes - 1} minutes`;
          }
        } else if (currentWait.includes("hr")) {
          const hours = parseInt(currentWait);
          const minutes = parseInt(
            currentWait.match(/(\d+) minutes/)?.[1] || 0
          );
          if (hours > 0 || minutes > 5) {
            if (minutes > 5) {
              item.estimatedWait = `${hours}hr ${minutes - 1} minutes`;
            } else if (hours > 0) {
              item.estimatedWait = `${hours - 1}hr 59 minutes`;
            }
          }
        }
      }
    }
    return item;
  });

  return updatedData;
};

const refreshQueueData = async () => {
  if (isRefreshing) return;

  isRefreshing = true;
  refreshButton.classList.add("refreshing");
  showLoadingState();

  try {
    const newData = await fetchQueueData();
    queueData = newData;
    renderQueueTable(queueData);
    lastUpdateTime = new Date();
    updateTimeDisplay();
  } catch (error) {
    console.error("Error fetching queue data:", error);
    // Show error state if needed
  } finally {
    isRefreshing = false;
    refreshButton.classList.remove("refreshing");
    hideLoadingState();
  }
};

const startAutoRefresh = () => {
  // Auto-refresh every 30 seconds
  autoRefreshInterval = setInterval(() => {
    refreshQueueData();
  }, 30000);
};

const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
};

// Mobile menu functionality
const toggleMobileMenu = () => {
  const isMenuOpen = mobileNavigation.classList.contains("active");

  if (isMenuOpen) {
    mobileNavigation.classList.remove("active");
    document.body.style.overflow = "auto";
  } else {
    mobileNavigation.classList.add("active");
    document.body.style.overflow = "hidden";
  }
};

const closeMobileMenu = () => {
  mobileNavigation.classList.remove("active");
  document.body.style.overflow = "auto";
};

// Keyboard shortcuts
const handleKeyboardShortcuts = (event) => {
  // R key to refresh
  if (event.key === "r" || event.key === "R") {
    event.preventDefault();
    refreshQueueData();
  }

  // Escape to close mobile menu
  if (event.key === "Escape") {
    closeMobileMenu();
  }
};

// Initialize page
const initializePage = async () => {
  showLoadingState();

  try {
    await refreshQueueData();
    startAutoRefresh();

    // Update time display every second
    setInterval(updateTimeDisplay, 1000);
  } catch (error) {
    console.error("Error initializing page:", error);
  }
};

// Event Listeners
refreshButton.addEventListener("click", refreshQueueData);
mobileMenuToggle.addEventListener("click", toggleMobileMenu);
mobileCloseButton.addEventListener("click", closeMobileMenu);

// Close mobile menu when clicking outside
document.addEventListener("click", (event) => {
  if (
    mobileNavigation.classList.contains("active") &&
    !mobileNavigation.contains(event.target) &&
    !mobileMenuToggle.contains(event.target)
  ) {
    closeMobileMenu();
  }
});

// Keyboard event listeners
document.addEventListener("keydown", handleKeyboardShortcuts);

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Page became visible, refresh data and restart auto-refresh
    refreshQueueData();
    startAutoRefresh();
  } else {
    // Page became hidden, stop auto-refresh to save resources
    stopAutoRefresh();
  }
});

// Handle page unload
window.addEventListener("beforeunload", () => {
  stopAutoRefresh();
});

// Initialize page when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);

// Export functions for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    fetchQueueData,
    formatTimeAgo,
    getStatusBadgeClass,
    createQueueRow,
    renderQueueTable,
  };
}
