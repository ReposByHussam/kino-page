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

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const fullName = form.elements.fullName?.value.trim() ?? "";
    const email = form.elements.email?.value.trim() ?? "";
    const message = form.elements.message?.value.trim() ?? "";

    let ok = true;

    if (fullName.length < 2) {
      setError("fullName", "Skriv in ditt namn igen, minst 2 tecken");
      ok = false;
    }
    if (!isValidEmail(email)) {
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

async function loadMovies(jsonPath, containerSelector) {
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`Kunde inte hämta: ${jsonPath}`);

    const movies = await response.json();

    const container = document.querySelector(containerSelector);
    if (!container) {
      console.warn(`Hittade ingen container för: ${containerSelector}`);
      return;
    }

    container.innerHTML = "";

    movies.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("movie-card");

      const tags = Array.isArray(movie.tags) ? movie.tags.join(", ") : "—";
      const age = movie.ageLimit ?? "—";
      const date = movie.releaseDate ?? "—";
      const lang = movie.language ?? "—";
      const desc = movie.description ?? "";

      card.innerHTML = `
        <h3>${movie.title}</h3>
        <p><strong>Genre:</strong> ${movie.genre}</p>
        <p><strong>Längd:</strong> ${movie.duration} min</p>
        <p><strong>Betyg:</strong> ⭐ ${movie.rating}</p>
        <p><strong>Ålder:</strong> ${age}</p>
        <p><strong>Datum:</strong> ${date}</p>
        <p><strong>Språk:</strong> ${lang}</p>
        <p><strong>Taggar:</strong> ${tags}</p>
        ${desc ? `<p><strong>Beskrivning:</strong> ${desc}</p>` : ""}
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

// Kör när HTML är redo
document.addEventListener("DOMContentLoaded", () => {
  setupRouting();
  setupContactForm();

  loadMovies("/src/data/today-movies.json", "#today-movies");
  loadMovies("/src/data/future-movies.json", "#future-movies");
});