function setupRouting() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-route]");
    if (!el) return;
    const route = el.dataset.route;
    if (!route) return;
    window.location.href = route;
  });
}

function setupContactForm() {
  const form = document.querySelector(".contact__form");
  if (!form) return;

  const successEl = form.querySelector(".contact__success");

  const setError = (fieldName, message) => {
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorEl) errorEl.textContent = message;
  };

  const clearErrors = () => {
    ["fullName", "email", "message"].forEach((name) => setError(name, ""));
    if (successEl) successEl.hidden = true;
  };

  const isvalidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const fullName = form.elements.fullName?.value.trim() ?? "";
    const email = form.elements.email?.value.trim() ?? "";
    const message = form.elements.message?.value.trim() ?? "";

    let ok = true;

    if (fullName.length < 3) {
      setError("fullName", "Skriv in ditt namn igen, minst 3 tecken");
      ok = false;
    }
    if (!isvalidEmail(email)) {
      setError("email", "Ange en giltig epost-address");
      ok = false;
    }
    if (message.length < 10) {
      setError("message", "Meddelandet måste innehålla minst 10 tecken");
      ok = false;
    }
    if (!ok) return;

    if (successEl) successEl.hidden = false;
    form.reset();
  });
}

function setupBookTableModal() {
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

setupRouting();
setupContactForm();
setupBookTableModal();