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

    if (fullName.length < 2) {
      setError(
        "fullName",
        "Please fill in your name properly, atleast 2 characters are required"
      );
      ok = false;
    }
    if (!isvalidEmail(email)) {
      setError("email", "Please enter a valid email address ");
      ok = false;
    }
    if (message.length < 5) {
      setError("message", "Please write a message with atleast 5 characters");
      ok = false;
    }
    if (!ok) return;
    if (successEl) successEl.hidden = false;
    form.reset();
  });
}

setupRouting();
setupContactForm();
