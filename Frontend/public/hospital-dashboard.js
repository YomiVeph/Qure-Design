"use strict";
const wrapper = document.getElementById("dateMeter");
const button = document.querySelector(".date-btn");
const menu = document.getElementById("menu");
const label = document.getElementById("current-date");
const startEl = document.getElementById("start-date");
const endEl = document.getElementById("end-date");
const apply = document.getElementById("applyBtn");
const clear = document.getElementById("clearBtn");
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

dropdownToggle.forEach((toggle) => {
  toggle.addEventListener("click", function (event) {
    event.stopPropagation();
    const dropdown = this.parentElement;
    const dropdownContent = dropdown.querySelector(".dropdown-content");
    document.querySelectorAll(".dropdown").forEach((drop) => {
      if (drop !== dropdown) {
        drop.classList.remove("show");
        drop.querySelector(".dropdown-content").style.display = "none";
      }
    });
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
      dropdown.classList.remove("open");
    } else {
      dropdownContent.style.display = "block";
      dropdown.classList.add("open");
    }
  });
});

liContent.forEach((item) => {
  item.addEventListener("click", function (event) {
    event.preventDefault();
    const dropdown = this.closest(".dropdown");
    const btns = dropdown.querySelector(".btn");
    btns.textContent = this.textContent;

    dropdown.classList.remove("open");
    dropdown.querySelector(".dropdown-content").style.display = "none";
  });
});

window.addEventListener("click", function () {
  this.document.querySelectorAll(".dropdown").forEach((drop) => {
    drop.classList.remove("open");
    drop.querySelector(".dropdown-content").style.display = "none";
  });
});

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
