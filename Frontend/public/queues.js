"use strict";
const wrapper = document.getElementById("dateMeter");
const button = document.querySelector(".date-btn");
const menu = document.getElementById("menu");
const label = document.getElementById("current-date");
const startEl = document.getElementById("start-date");
const endEl = document.getElementById("end-date");
const apply = document.getElementById("applyBtn");
const clear = document.getElementById("clearBtn");
const checkboxes = document.querySelectorAll(
  ".list-table tbody input[type='checkbox']"
);
const profileSection = document.querySelector(".profile-details");
const nextBtn = document.querySelector(".profile-button .next");
const prevBtn = document.querySelector(".profile-button .prev");
const dropdownToggle = document.querySelectorAll(".dropdown-toggle");
const liContent = document.querySelectorAll(".dropdown-content li");

button.addEventListener("click", () => {
  const nowOpen = wrapper.classList.toggle("open");
  button.setAttribute("aria-expanded", String(nowOpen));
  if (nowOpen) requestAnimationFrame(() => adjustMenuPosition());
});

apply.addEventListener("click", () => {
  const s = startEl.value,
    e = endEl.value;
  if (!s || !e) {
    wrapper.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    return;
  }
  let sDate = new Date(s),
    eDate = new Date(e);
  if (sDate > eDate) [sDate, eDate] = [eDate, sDate];
  label.textContent = formatRange(sDate, eDate);
  wrapper.classList.remove("open");
  button.setAttribute("aria-expanded", "false");
});

clear.addEventListener("click", () => {
  startEl.value = "";
  endEl.value = "";
  startEl.focus();
});

document.addEventListener("click", (e) => {
  if (!wrapper.contains(e.target)) {
    wrapper.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    menu.style.left = "";
    menu.style.right = "";
    menu.style.top = "";
    menu.style.bottom = "";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    wrapper.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    button.focus();
    menu.style.left = "";
    menu.style.right = "";
    menu.style.top = "";
    menu.style.bottom = "";
  }
});

function adjustMenuPosition() {
  menu.style.left = "0";
  menu.style.right = "";
  menu.style.top = "calc(100% + 8px)";
  menu.style.bottom = "";
  const rect = menu.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    menu.style.left = "auto";
    menu.style.right = "0";
  }
  const updated = menu.getBoundingClientRect();
  if (
    updated.bottom > window.innerHeight &&
    updated.height + 12 < wrapper.getBoundingClientRect().top
  ) {
    menu.style.top = "";
    menu.style.bottom = "calc(100% + 8px)";
  }
}

function formatRange(sDate, eDate) {
  const startStr = sDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const sameYear = sDate.getFullYear() === eDate.getFullYear();
  const endStr = eDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
  return `${startStr} - ${endStr}`;
}

// ===== Dropdown Logic =====
// Handle dropdown toggle
const dropdownToggles = document.querySelectorAll(
  ".hosp-dropdown-toggle, .dept-dropdown-toggle"
);

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", function () {
    const dropdown = this.parentElement;
    dropdown.classList.toggle("open");

    // Close other dropdowns
    document.querySelectorAll(".dropdown").forEach((d) => {
      if (d !== dropdown) d.classList.remove("open");
    });
  });
});

// Handle option select
const dropdownItems = document.querySelectorAll(".dropdown-content li");

dropdownItems.forEach((item) => {
  item.addEventListener("click", function () {
    const dropdown = this.closest(".dropdown");
    const button = dropdown.querySelector(".btn");
    button.textContent = this.textContent;
    dropdown.classList.remove("open");
  });
});

let selectedPatients = []; // history of checked patients
let currentIndex = -1;

// Update profile UI
function updateProfile(row) {
  const name = row.querySelector(".name").innerText.trim();
  const img = row.querySelector(".name img").src;
  const status = row.querySelector("td:nth-child(4) .status").innerText;
  const ticket = row.querySelector("td:nth-child(3)").innerText;
  const room = row.querySelector("td:nth-child(6)").innerText;

  profileSection.innerHTML = `
    <div class="pic-name">
      <div class="prof-pic">
        <img src="${img}" alt="${name}-profile-pic" />
      </div>
      <div class="profile-name">
        <h2>${name}</h2>
        <p>Ticket: ${ticket}</p>
        <p>Status: ${status}</p>
        <p>Room: ${room}</p>
      </div>
    </div>
    <div class="history">
      <h3>Queue History</h3>
      <p>Visit 1: Feb, 11 2023</p>
      <p>Visit 2: May, 8 2023</p>
    </div>
    <div class="notes">
      <h3>Notes</h3>
      <p>Patient details updated dynamically</p>
    </div>
  `;
}

// Handle checkbox selection
checkboxes.forEach((cb, index) => {
  cb.addEventListener("change", function () {
    if (this.checked) {
      // Uncheck all others
      checkboxes.forEach((other) => {
        if (other !== this) other.checked = false;
      });

      const row = this.closest("tr");
      updateProfile(row);

      // Add to history
      const rowId = index; // row index
      if (!selectedPatients.includes(rowId)) {
        selectedPatients.push(rowId);
      }
      currentIndex = selectedPatients.indexOf(rowId);
    }
  });
});

// Next button
nextBtn.addEventListener("click", () => {
  if (currentIndex < selectedPatients.length - 1) {
    currentIndex++;
    const rowIndex = selectedPatients[currentIndex];
    const row = checkboxes[rowIndex].closest("tr");
    checkboxes.forEach((cb) => (cb.checked = false));
    checkboxes[rowIndex].checked = true;
    updateProfile(row);
  }
});

// Previous button
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    const rowIndex = selectedPatients[currentIndex];
    const row = checkboxes[rowIndex].closest("tr");
    checkboxes.forEach((cb) => (cb.checked = false));
    checkboxes[rowIndex].checked = true;
    updateProfile(row);
  }
});

// Close dropdowns when clicking outside
document.addEventListener("click", function (e) {
  if (!e.target.closest(".dropdown")) {
    document
      .querySelectorAll(".dropdown")
      .forEach((d) => d.classList.remove("open"));
  }
});

// ===== Queue Management =====
const queueList = document.getElementById("queue-list");
const callNextBtn = document.querySelector(".btn-success");
const resetBtn = document.querySelector(".btn-danger");
const addBtn = document.querySelector(".btn-primary");
const patientInput = document.getElementById("patient-name");
let queue = [];

// Add patient to queue
function addPatient(name) {
  if (!name.trim()) return;
  queue.push(name.trim());
  renderQueue();
  patientInput.value = "";
}

function renderQueue() {
  queueList.innerHTML = "";
  queue.forEach((patient, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${patient}`;
    queueList.appendChild(li);
  });
}

// Call next patient
callNextBtn.addEventListener("click", function () {
  if (queue.length === 0) {
    alert("No patients in queue");
    return;
  }
  const next = queue.shift();
  alert(`Calling: ${next}`);
  renderQueue();
});

// Reset queue
resetBtn.addEventListener("click", function () {
  queue = [];
  renderQueue();
  alert("Queue has been reset");
});

// Add patient from input
addBtn.addEventListener("click", function () {
  addPatient(patientInput.value);
});

// Allow Enter key to add patient
patientInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addPatient(patientInput.value);
  }
});

// Demo patients for testing
addPatient("John Doe");
addPatient("Jane Smith");
addPatient("Ali Musa");
