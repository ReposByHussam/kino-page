function setupRouting() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-route]");
    if (!el) return;
    const route = el.dataset.route;
    if (!route) return;
    window.location.href = route;
  });
}
setupRouting();
