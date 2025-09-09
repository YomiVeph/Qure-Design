"use strict";
const tbody = document.querySelector("#deptTable tbody");
const addBtn = document.getElementById("addDeptBtn");
const saveAllBtn = document.getElementById("saveAllBtn");
const savedIndicator = document.getElementById("savedIndicator");
const STORAGE_KEY = "departmentsData_v1";

const modal = document.getElementById("confirmModal");
const modalMessage = document.getElementById("modalMessage");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

let modalAction = null;

function openModal(message, action) {
  modalMessage.textContent = message;
  modal.style.display = "flex";
  modalAction = action;
}

yesBtn.addEventListener("click", () => {
  if (modalAction) modalAction();
  modal.style.display = "none";
});

noBtn.addEventListener("click", () => {
  modal.style.display = "none";
  modalAction = null;
});

function createDisplayRow(dept, code, status) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${escapeHtml(dept)}</td>
    <td>${escapeHtml(code)}</td>
    <td><span class="status ${status}">${capitalize(status)}</span></td>
    <td>
      <div class="action-icons">
        <span class="material-symbols-outlined edit">edit</span>
        <span class="material-symbols-outlined delete">delete</span>
      </div>
    </td>
  `;
  attachRowEvents(tr);
  return tr;
}

function createEditableRow(
  dept = "",
  code = "",
  status = "active",
  isNew = true
) {
  const tr = document.createElement("tr");
  tr.dataset.isNew = isNew ? "true" : "false";
  tr.innerHTML = `
    <td><input type="text" value="${escapeHtml(
      dept
    )}" placeholder="Department" /></td>
    <td><input type="text" value="${escapeHtml(
      code
    )}" placeholder="Short code" /></td>
    <td>
      <select>
        <option value="active" ${
          status === "active" ? "selected" : ""
        }>Active</option>
        <option value="inactive" ${
          status === "inactive" ? "selected" : ""
        }>Inactive</option>
      </select>
    </td>
    <td>
      <div class="action-icons">
        <span class="material-symbols-outlined save">check</span>
        <span class="material-symbols-outlined cancel">close</span>
      </div>
    </td>
  `;

  tr.querySelector(".save").addEventListener("click", () => {
    const inputs = tr.querySelectorAll("input[type=text]");
    const deptVal = inputs[0].value.trim();
    const codeVal = inputs[1].value.trim();
    const statusVal = tr.querySelector("select").value;

    if (!deptVal || !codeVal) {
      alert("Please fill Department and Short code before saving this row.");
      return;
    }

    const newRow = createDisplayRow(deptVal, codeVal, statusVal);
    tr.replaceWith(newRow);
    indicateUnsaved();
  });

  tr.querySelector(".cancel").addEventListener("click", () => {
    openModal("Do you want to cancel changes?", () => {
      if (tr.dataset.isNew === "true") {
        tr.remove();
      } else {
        const origDept = tr.dataset.origDept || "";
        const origCode = tr.dataset.origCode || "";
        const origStatus = tr.dataset.origStatus || "active";
        const restored = createDisplayRow(origDept, origCode, origStatus);
        tr.replaceWith(restored);
      }
    });
  });

  return tr;
}

function attachRowEvents(row) {
  const editBtn = row.querySelector(".edit");
  const deleteBtn = row.querySelector(".delete");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const dept = row.cells[0].innerText.trim();
      const code = row.cells[1].innerText.trim();
      const status = row.cells[2].innerText.trim().toLowerCase();

      const editable = createEditableRow(dept, code, status, false);
      editable.dataset.origDept = dept;
      editable.dataset.origCode = code;
      editable.dataset.origStatus = status;
      row.replaceWith(editable);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      openModal("Do you want to delete this department?", () => {
        row.remove();
        indicateUnsaved();
      });
    });
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function indicateUnsaved() {
  savedIndicator.style.display = "none";
}

function saveAllToStorage() {
  const rows = Array.from(tbody.rows);
  const data = rows.map((r) => {
    const input = r.querySelector("input[type=text]");
    if (input) {
      return {
        dept: r.querySelectorAll("input[type=text]")[0].value.trim(),
        code: r.querySelectorAll("input[type=text]")[1].value.trim(),
        status: r.querySelector("select").value,
      };
    } else {
      return {
        dept: r.cells[0].innerText.trim(),
        code: r.cells[1].innerText.trim(),
        status: r.cells[2].innerText.trim().toLowerCase(),
      };
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  savedIndicator.style.display = "inline-block";
  setTimeout(() => {
    savedIndicator.style.display = "none";
  }, 1400);
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return;

    tbody.innerHTML = "";
    arr.forEach((item) => {
      const r = createDisplayRow(
        item.dept || "",
        item.code || "",
        item.status || "active"
      );
      tbody.appendChild(r);
    });
  } catch (e) {
    console.error("Failed to load departments", e);
  }
}

addBtn.addEventListener("click", () => {
  const editable = createEditableRow("", "", "active", true);
  tbody.appendChild(editable);
  const firstInput = editable.querySelector("input[type=text]");
  if (firstInput) firstInput.focus();
});

saveAllBtn.addEventListener("click", () => {
  saveAllToStorage();
});

document
  .querySelectorAll("#deptTable tbody tr")
  .forEach((tr) => attachRowEvents(tr));
loadFromStorage();
