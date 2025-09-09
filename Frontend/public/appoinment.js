"use strict";
const dateMeter = document.getElementById("dateMeter");
const dateBtn = dateMeter.querySelector(".date-btn");
const dateMenu = document.getElementById("menu");
const startDate = document.getElementById("start-date");
const endDate = document.getElementById("end-date");
const clearBtn = document.getElementById("clearBtn");
const applyBtn = document.getElementById("applyBtn");
const currentDate = document.getElementById("current-date");
const newApptBtn = document.querySelector(".appt-btn");
const tableBody = document.querySelector("tbody");
const profileSection = document.querySelector(".profile-details");
const modal = document.getElementById("appointmentModal");
const closeBtn = document.querySelector(".close-btn");
const apptForm = document.getElementById("appointmentForm");

newApptBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

apptForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const patient = document.getElementById("patientName").value;
  const doctorName = document.getElementById("doctorName").value;
  const dept = document.getElementById("department").value;
  const type = document.getElementById("apptType").value;
  const dateTime = document.getElementById("apptDateTime").value;
  const status = document.getElementById("apptStatus").value;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${patient}</td>
    <td>${doctorName}</td>
    <td>${dept}</td>
    <td><span class="status ${status.toLowerCase()}">${status}</span></td>
    <td>${type}</td>
    <td>${new Date(dateTime).toLocaleString()}</td>
  `;
  tableBody.appendChild(row);

  row.addEventListener("click", () =>
    showProfile(
      patient,
      { name: doctorName, dept: dept },
      type,
      status,
      new Date(dateTime).toLocaleString()
    )
  );
  apptForm.reset();
  modal.style.display = "none";
});

function showProfile(patient, doctor, type, status, dateTime) {
  const phone = `(234) ${Math.floor(700 + Math.random() * 200)} ${Math.floor(
    100 + Math.random() * 900
  )} ${Math.floor(1000 + Math.random() * 9000)}`;
  const mrn = Math.floor(100000 + Math.random() * 900000);
  const note = "Manual entry appointment";

  profileSection.innerHTML = `
    <div class="pic-name">
      <div class="profile-name">
        <h2>${patient}</h2>
        <p>${phone}</p>
        <p>MRN ${mrn}</p>
      </div>
    </div>
    <div class="history">
      <h3>Appointment Details</h3>
      <p>Time: ${dateTime}</p>
      <p>Department: ${doctor.dept}</p>
      <p>Doctor: ${doctor.name}</p>
      <p>Type: ${type}</p>
      <p>Status: ${status}</p>
      <p>Notes: ${note}</p>
    </div>
    <div class="notes">
      <h3>Notes</h3>
      <p>Patient is allergic to penicillin</p>
    </div>
    <div class="check-btn-profile">
      <div class="profile-button-1">
        <button class="next pro-btn" onclick="alert('Checked-in!')">Check-in</button>
        <button class="prev pro-btn" onclick="alert('Moved to Queue!')">Move to Queue</button>
      </div>
      <div class="profile-button">
        <button class="next pro-btn" onclick="alert('Message Sent!')">Message</button>
        <button class="prev pro-btn" onclick="alert('Edit Appointment!')">Edit</button>
      </div>
    </div>
  `;
}

dateBtn.addEventListener("click", () => {
  dateMeter.classList.toggle("open");
});

// Apply selected dates
applyBtn.addEventListener("click", () => {
  if (startDate.value && endDate.value) {
    currentDate.textContent = `${startDate.value} → ${endDate.value}`;
  } else {
    currentDate.textContent = "Date Range";
  }
  dateMeter.classList.remove("open");
});

// Clear dates
clearBtn.addEventListener("click", () => {
  startDate.value = "";
  endDate.value = "";
  currentDate.textContent = "Date Range";
});

// Close if clicking outside
document.addEventListener("click", (e) => {
  if (!dateMeter.contains(e.target)) {
    dateMeter.classList.remove("open");
  }
});

const deptDropdown = document.querySelector(".dept-dropdown");
const deptBtn = deptDropdown.querySelector(".dept-btn");
const deptArrow = deptDropdown.querySelector(".dept-arrow");
const deptContent = deptDropdown.querySelector(".dept-dropdown-content");
const deptItems = deptContent.querySelectorAll("li");

deptBtn.addEventListener("click", () => {
  deptDropdown.classList.toggle("open");
});

deptItems.forEach((item) => {
  item.addEventListener("click", () => {
    deptBtn.textContent = item.textContent;
    deptDropdown.classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (!deptDropdown.contains(e.target)) {
    deptDropdown.classList.remove("open");
  }
});
