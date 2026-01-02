export function setupBookTableModal() {
  const dialog = document.querySelector("#bookTableModal");
  const openButtons = document.querySelectorAll("[data-book-table]");
  if (!dialog || openButtons.length === 0) return;

  const form = dialog.querySelector(".book-table-form");
  const step1 = dialog.querySelector('[data-step="1"]');
  const step2 = dialog.querySelector('[data-step="2"]');
  const nextBtn = dialog.querySelector("[data-modal-next]");
  const backBtn = dialog.querySelector("[data-modal-back]");
  const closeBtns = dialog.querySelectorAll("[data-modal-close]");
  const confirmation = dialog.querySelector(".book-table-form__confirmation");

  const showStep = (step) => {
    if (!step1 || !step2) return;
    if (step === 1) {
      step1.hidden = false;
      step2.hidden = true;
    } else {
      step1.hidden = true;
      step2.hidden = false;
    }
  };

  const resetModal = () => {
    if (confirmation) confirmation.hidden = true;
    if (form) form.reset();
    showStep(1);
  };

  const openModal = () => {
    resetModal();
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  };

  const closeModal = () => {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  };

  openButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const dateEl = form?.querySelector("#bookingDate");
      const timeEl = form?.querySelector("#bookingTime");
      const peopleEl = form?.querySelector("#bookingPeople");

      const ok =
        dateEl?.checkValidity() !== false &&
        timeEl?.checkValidity() !== false &&
        peopleEl?.checkValidity() !== false;

      if (!ok) {
        form?.reportValidity?.();
        return;
      }

      showStep(2);
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      showStep(1);
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = form.checkValidity();
      if (!ok) {
        form.reportValidity?.();
        return;
      }

      if (confirmation) confirmation.hidden = false;
      showStep(1);

      setTimeout(() => {
        closeModal();
      }, 900);
    });
  }

  dialog.addEventListener("click", (e) => {
    const rect = dialog.getBoundingClientRect();
    const inDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!inDialog) closeModal();
  });

  dialog.addEventListener("close", () => {
    resetModal();
  });
}