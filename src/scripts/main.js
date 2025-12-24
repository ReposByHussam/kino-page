async function loadMovies(jsonPath, containerSelector) {
  const response = await fetch(jsonPath);
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
}

// Kör när HTML är redo
document.addEventListener("DOMContentLoaded", () => {
  loadMovies("/src/data/today-movies.json", "#today-movies");
  loadMovies("/src/data/future-movies.json", "#future-movies");
});