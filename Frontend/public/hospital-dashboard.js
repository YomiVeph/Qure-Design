"use strict";

/* ---------- DOM refs ---------- */
const wrapper = document.getElementById("dateMeter");
const button = document.querySelector(".date-btn");
const menu = document.getElementById("menu");
const label = document.getElementById("current-date");
const startEl = document.getElementById("start-date");
const endEl = document.getElementById("end-date");
const apply = document.getElementById("applyBtn");
const clear = document.getElementById("clearBtn");
const queueTableBody = document.querySelector(".queue-list tbody");
const queueLengthEl = document.getElementById("queue-length");
const noShowEl = document.getElementById("no-shows");
const callNextBtn = document.getElementById("callNextBtn");

/* ---------- Date range UI (unchanged) ---------- */
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

/* ---------- Helper: map status -> icon + color-class ---------- */
function getActionIcon(status) {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "called":
    case "waiting":
      return { icon: "campaign", className: "call" }; // campaign or call icon
    case "no show":
    case "no-show":
      return { icon: "error", className: "error" };
    case "in triage":
      return { icon: "local_hospital", className: "hospi-icon" };
    case "with doc":
      return { icon: "medical_services", className: "check" };
    case "completed":
    case "checked-in":
      return { icon: "check", className: "check" };
    default:
      return { icon: "mail", className: "mail" };
  }
}

/* ---------- Utility: find column indexes by header label ---------- */
function getColumnIndexes() {
  const headers = Array.from(document.querySelectorAll(".queue-list thead th"));
  const indexes = {
    department: -1,
    status: -1,
    wait: -1,
    action: -1,
  };
  headers.forEach((th, i) => {
    const t = th.textContent.trim().toLowerCase();
    if (t.includes("department")) indexes.department = i;
    if (t.includes("status")) indexes.status = i;
    if (t.includes("waiting")) indexes.wait = i;
    if (t.includes("action")) indexes.action = i;
  });
  return indexes;
}
let colIdx = getColumnIndexes();

/* ---------- Ensure header department dropdown has an "All" option ---------- */
function ensureHeaderAllOption() {
  const headerUl = document.querySelector(
    ".department-dropdown .dropdown-content"
  );
  if (!headerUl) return;
  const hasAll = Array.from(headerUl.querySelectorAll("li")).some(
    (li) => li.textContent.trim().toLowerCase() === "all"
  );
  if (!hasAll) {
    const allLi = document.createElement("li");
    allLi.textContent = "All";
    headerUl.insertBefore(allLi, headerUl.firstChild);
  }
}
ensureHeaderAllOption();

/* ---------- Filter rows by department (header filter) ---------- */
let currentDeptFilter = null;
function filterRowsByDepartment(selected) {
  selected = (selected || "").trim();
  currentDeptFilter = selected.toLowerCase() === "all" ? null : selected;
  const rows = Array.from(queueTableBody.querySelectorAll("tr"));
  rows.forEach((r) => {
    const deptCell = r.cells[colIdx.department];
    const deptText = (deptCell ? deptCell.textContent : "").trim();
    if (!currentDeptFilter) {
      r.style.display = ""; // show all
    } else {
      r.style.display =
        deptText.toLowerCase() === currentDeptFilter.toLowerCase()
          ? ""
          : "none";
    }
  });
  updateStats();
}

/* ---------- addQueueRow (use header department list for random picks) ---------- */
function addQueueRow(name, ticket, department, status, wait) {
  // create row with 6 columns to match your table (Name, Ticket, Dept, Status, Wait, Action)
  const action = getActionIcon(status);
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${name}</td>
    <td>${ticket}</td>
    <td>${department}</td>
    <td>${status}</td>
    <td>${wait}</td>
    <td><span class="material-symbols-outlined ${action.className}">${action.icon}</span></td>
  `;
  queueTableBody.appendChild(tr);

  // re-apply header filter (if any) so newly added rows obey current filter
  if (currentDeptFilter) filterRowsByDepartment(currentDeptFilter);
  updateStats();
}

/* ---------- Stats (counts use VISIBLE rows only) ---------- */
function updateStats() {
  const rows = Array.from(queueTableBody.querySelectorAll("tr"));
  let totalWait = 0;
  let visibleCount = 0;
  let noShows = 0;

  rows.forEach((row) => {
    if (row.style.display === "none") return; // skip hidden rows
    visibleCount++;
    const status = (row.cells[colIdx.status]?.textContent || "")
      .trim()
      .toLowerCase();
    const waitText = (row.cells[colIdx.wait]?.textContent || "").trim();
    const waitMins = parseInt(waitText, 10) || 0;
    totalWait += waitMins;
    if (status === "no show" || status === "no-show") noShows++;
  });

  queueLengthEl.textContent = visibleCount;
  noShowEl.textContent = noShows;
  const avg = visibleCount > 0 ? Math.round(totalWait / visibleCount) : 0;
  document.getElementById("avg-wait").textContent = avg + " mins";
}

/* ---------- Get department options from the table header (exclude 'All') ---------- */
function getHeaderDeptOptions() {
  const lis = Array.from(
    document.querySelectorAll(".department-dropdown .dropdown-content li")
  );
  return lis
    .map((li) => li.textContent.trim())
    .filter((t) => t && t.toLowerCase() !== "all");
}

/* ---------- Event delegation for dropdown toggles and list items ---------- */
document.addEventListener("click", (e) => {
  // --- handle toggle clicks (open/close) ---
  const toggle = e.target.closest(".dropdown-toggle");
  if (toggle) {
    e.stopPropagation();
    const dropdown = toggle.closest(".dropdown");
    const content = dropdown.querySelector(".dropdown-content");
    // close other dropdowns
    document.querySelectorAll(".dropdown").forEach((d) => {
      if (d !== dropdown) {
        d.classList.remove("open");
        const c = d.querySelector(".dropdown-content");
        if (c) c.style.display = "none";
      }
    });
    // toggle current
    if (!content) return;
    if (content.style.display === "block") {
      content.style.display = "none";
      dropdown.classList.remove("open");
    } else {
      content.style.display = "block";
      dropdown.classList.add("open");
    }
    return;
  }

  // --- handle li selection inside any dropdown ---
  const li = e.target.closest(".dropdown-content li");
  if (li) {
    e.stopPropagation();
    const dropdown = li.closest(".dropdown");
    const btn = dropdown.querySelector(
      ".btn, .btns, .dept-btn, .select-btn, .hosp-btn"
    );
    if (btn) btn.textContent = li.textContent;

    // close the dropdown
    const content = dropdown.querySelector(".dropdown-content");
    if (content) content.style.display = "none";
    dropdown.classList.remove("open");

    // If this was the header department dropdown -> filter table
    if (
      dropdown.classList.contains("department-dropdown") ||
      dropdown.classList.contains("dept-dropdown")
    ) {
      filterRowsByDepartment(li.textContent.trim());
      return;
    }

    // If the li was inside a dropdown that sits inside a table row, update that row's relevant cell
    const row = li.closest("tr");
    if (row) {
      // find which column this dropdown sits in by walking up to the td
      const td = li.closest("td");
      if (!td) return;
      const cellIndex = Array.from(td.parentElement.children).indexOf(td);

      // If clicked dropdown is inside the department column, update department text
      if (cellIndex === colIdx.department) {
        row.cells[colIdx.department].textContent = li.textContent.trim();
        // Apply header filter if any
        if (currentDeptFilter) filterRowsByDepartment(currentDeptFilter);
        updateStats();
        return;
      }

      // If clicked dropdown relates to status column, update status + action icon
      if (cellIndex === colIdx.status) {
        row.cells[colIdx.status].textContent = li.textContent.trim();
        // update action icon in the action cell
        const newAction = getActionIcon(li.textContent.trim());
        const actionCell = row.cells[colIdx.action];
        if (actionCell) {
          actionCell.innerHTML = `<span class="material-symbols-outlined ${newAction.className}">${newAction.icon}</span>`;
        }
        updateStats();
        return;
      }
    }
  }

  // close any open dropdown if clicked outside
  document.querySelectorAll(".dropdown").forEach((d) => {
    d.classList.remove("open");
    const c = d.querySelector(".dropdown-content");
    if (c) c.style.display = "none";
  });
});

/* ---------- Call Next: choose status randomly and dept from header list ---------- */
callNextBtn.addEventListener("click", () => {
  const randomId = Math.floor(Math.random() * 1000);
  const statuses = [
    "Waiting",
    "Called",
    "In Triage",
    "With Doc",
    "Completed",
    "No show",
  ];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  const headerDepts = getHeaderDeptOptions();
  const dept = headerDepts.length
    ? headerDepts[Math.floor(Math.random() * headerDepts.length)]
    : "General";

  addQueueRow(
    "Patient " + randomId,
    "T-" + randomId,
    dept,
    randomStatus,
    Math.floor(Math.random() * 10) + " mins"
  );
});

/* ---------- Initialize: compute indexes and update stats ---------- */
colIdx = getColumnIndexes();
updateStats();

/* ---------- Charts initialization (unchanged) ---------- */
/* paste your existing Chart.js initialization below — left as-is in your file */

// chart
// Daily Trends Chart
const dailyCtx = document.getElementById("dailyChart");
const dailyChart = new Chart(dailyCtx, {
  type: "line",
  data: {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Patients Served",
        data: [120, 150, 180, 140, 200, 250, 220],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: "#2563eb",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#374151",
          font: { size: 14 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280" },
        grid: { color: "#e5e7eb" },
      },
      y: {
        ticks: { color: "#6b7280" },
        grid: { color: "#e5e7eb" },
      },
    },
  },
});

// Peak Hours Chart
const hoursCtx = document.getElementById("hoursChart");
const hoursChart = new Chart(hoursCtx, {
  type: "bar",
  data: {
    labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
    datasets: [
      {
        label: "Patients",
        data: [30, 50, 75, 60, 90, 40, 20],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "#10b981",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280" },
        grid: { color: "#f3f4f6" },
      },
      y: {
        ticks: { color: "#6b7280" },
        grid: { color: "#f3f4f6" },
      },
    },
  },
});
