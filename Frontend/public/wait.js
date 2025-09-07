"use strict";

// ===== Dropdown Functionality =====
document.querySelectorAll(".dropdown").forEach((dropdown) => {
  const toggle = dropdown.querySelector(".dropdown-toggle");
  const content = dropdown.querySelector(".dropdown-content");
  const button = toggle.querySelector("button");

  // Toggle open/close
  toggle.addEventListener("click", () => {
    document.querySelectorAll(".dropdown").forEach((d) => {
      if (d !== dropdown) {
        d.classList.remove("open");
        d.querySelector(".dropdown-content").style.display = "none";
      }
    });

    dropdown.classList.toggle("open");
    content.style.display = dropdown.classList.contains("open")
      ? "block"
      : "none";
  });

  // ✅ This must be inside so it has access to button & content
  content.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      button.textContent = item.textContent.trim(); // replace button label
      dropdown.classList.remove("open"); // close dropdown
      content.style.display = "none";
    });
  });
});

// Close dropdown if clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.remove("open");
      dropdown.querySelector(".dropdown-content").style.display = "none";
    });
  }
});

// ===== Details Panel =====
const detailsPanel = document.querySelector(".details");

function updateDetails(name, capacity, status, patients = []) {
  detailsPanel.innerHTML = `
    <h2>${name}</h2>
    <p>${capacity}</p>
    ${status === "CRITICAL" ? '<div class="critical">CRITICAL</div>' : ""}
    <div class="patient-list">
      ${
        patients.length
          ? patients
              .map(
                (p) => `<div><span>${p.name}</span><span>${p.time}</span></div>`
              )
              .join("")
          : "<p>No patients yet.</p>"
      }
    </div>
    <div class="actions">
      <button>Email</button>
      <button>Speaker</button>
      <button class="confirm">Confirm</button>
    </div>
  `;
}

// Attach click events to waiting rooms
function attachRoomClick(roomEl) {
  roomEl.addEventListener("click", () => {
    const name = roomEl.querySelector("h3").innerText;
    const capacity = roomEl.querySelector("span").innerText;

    const status = capacity.includes("100%") ? "CRITICAL" : "";

    // Example dummy patient list
    const patients = [
      { name: "John Doe", time: "2 mins" },
      { name: "Jane Smith", time: "5 mins" },
    ];

    updateDetails(name, capacity, status, patients);
  });
}

// Attach click for all existing rooms
document.querySelectorAll(".room").forEach(attachRoomClick);

// ===== Add New Waiting Area =====
const addBtn = document.querySelector(".add-btn");
const waitingAreas = document.querySelector(".waiting-areas");
let roomCounter = 7;

addBtn.addEventListener("click", () => {
  const roomLetter = String.fromCharCode(64 + roomCounter);
  const newRoom = document.createElement("div");

  // Assign random status color
  const colors = ["yellow", "green", "orange", "red"];
  const colorClass = colors[Math.floor(Math.random() * colors.length)];

  newRoom.classList.add("room", colorClass);
  newRoom.innerHTML = `
    <h3>Waiting Room ${roomLetter}</h3>
    <p>New Department Area</p>
    <span>0/20 (0%) - Last updated: Just now</span>
  `;

  waitingAreas.appendChild(newRoom);
  attachRoomClick(newRoom);
  roomCounter++;
});
