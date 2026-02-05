//get movie id from DOM
function getMovieIdFromDom() {
  const el = document.querySelector("#movie-rating");
  return el?.dataset?.movieId || 
         window.location.pathname.match(/\/movies\/([^/]+)/)?.[1];
}

async function loadRating() {
  const ratingel = document.querySelector("#movie-rating");
  if (!ratingel) return;

  const movieId = getMovieIdFromDom();
  if (!movieId) {
    ratingel.textContent = "Kunde inte hitta film.";
    return;
  }

  ratingel.textContent = "Laddar betyg…";

  try {
    const res = await fetch(`/api/movies/${encodeURIComponent(movieId)}/rating`);
    
    if (!res.ok) {
      ratingel.textContent = "Inget betyg tillgängligt";
      return;
    }

    const data = await res.json();
    
    if (data.rating) {
      ratingel.innerHTML = `${data.rating} (${data.source})`;
    } else {
      ratingel.textContent = "Inget betyg ännu";
    }
  } catch (err) {
    console.error("Rating fetch failed:", err);
    ratingel.textContent = "Kunde inte ladda betyget";
  }
}

document.addEventListener("DOMContentLoaded", loadRating);