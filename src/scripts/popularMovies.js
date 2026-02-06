export async function setupPopularMovies() {
    const container = document.getElementById("popular-movies");
    if (!container) return;

    try {
        const res = await fetch("/api/popular-movies");
        const movies = await res.json();

        container.innerHTML = "";

        movies.forEach(movie => {
            const article = document.createElement("article");
            article.classList.add("card", "movieCard");

            const rating =
                typeof movie.averageRating === "number"
                    ? `⭐ ${movie.averageRating.toFixed(1)} / 5`
                    : "⭐ Inga betyg ännu";

            article.innerHTML = `
        <h3 class="movieCard__title">${movie.title}</h3>

        <img
          class="movieCard__img"
          src="${movie.image?.url || "/src/placeholders/movie.jpg"}"
          alt="${movie.title} poster"
        >

        <p class="movieCard__item">${rating}</p>

        <a
          href="/movies/${movie.id}"
          class="btn btn--secondary movieCard__button"
        >
          Läs mer
        </a>
      `;

            container.appendChild(article);
        });
    } catch (err) {
        console.error("Failed to load popular movies", err);
    }
}