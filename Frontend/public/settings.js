"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const hospitalName = document.querySelector(
    "input[placeholder='General Hospital Abuja']"
  );
  const address = document.querySelector(
    "input[placeholder='1234 Main St., Abuja']"
  );
  const uploadBox = document.getElementById("upload-box");
  const logoInput = document.getElementById("logo-input");

  const saveBtn = document.querySelector(".btn.save");
  const cancelBtn = document.querySelector(".btn.cancel");

  const popupSaveConfirm = document.getElementById("popup-save-confirm");
  const confirmSave = document.getElementById("confirm-save");
  const closeSaveConfirm = document.getElementById("close-save-confirm");

  const popupSaveSuccess = document.getElementById("popup-save-success");
  const closeSaveSuccess = document.getElementById("close-save-success");

  const popupError = document.getElementById("popup-error");
  const closeError = document.getElementById("close-error");

  const popupCancel = document.getElementById("popup-cancel");
  const confirmCancel = document.getElementById("confirm-cancel");
  const closeCancel = document.getElementById("close-cancel");

  let logoUploaded = false;

  uploadBox.addEventListener("click", () => logoInput.click());
  logoInput.addEventListener("change", () => {
    if (logoInput.files.length > 0) {
      uploadBox.textContent = logoInput.files[0].name;
      uploadBox.classList.add("selected");
      logoUploaded = true;
    }
  });

  saveBtn.addEventListener("click", () => {
    if (!hospitalName.value.trim() || !address.value.trim() || !logoUploaded) {
      popupError.style.display = "flex";
    } else {
      popupSaveConfirm.style.display = "flex";
    }
  });

  confirmSave.addEventListener("click", () => {
    popupSaveConfirm.style.display = "none";
    popupSaveSuccess.style.display = "flex";
  });

  closeSaveConfirm.addEventListener(
    "click",
    () => (popupSaveConfirm.style.display = "none")
  );
  closeSaveSuccess.addEventListener(
    "click",
    () => (popupSaveSuccess.style.display = "none")
  );
  closeError.addEventListener(
    "click",
    () => (popupError.style.display = "none")
  );

  cancelBtn.addEventListener(
    "click",
    () => (popupCancel.style.display = "flex")
  );
  closeCancel.addEventListener(
    "click",
    () => (popupCancel.style.display = "none")
  );
  confirmCancel.addEventListener("click", () => {
    popupCancel.style.display = "none";
    hospitalName.value = "";
    address.value = "";
    uploadBox.textContent = "Upload Logo";
    uploadBox.classList.remove("selected");
    logoUploaded = false;
  });

  document.querySelectorAll(".popup").forEach((popup) => {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) popup.style.display = "none";
    });
  });
});
