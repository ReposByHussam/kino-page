import fetch from "node-fetch"; //HTTP-request module for Node.js (not available in browser)
import getPopularMovies from "./popularMovies.js";

const API_BASE = "https://plankton-app-xhkom.ondigitalocean.app/api";

//function for fetching all movies from API https://plankton-app-xhkom.ondigitalocean.app/api/movies
async function loadMovies() {
  const res = await fetch(API_BASE + "/movies");
  const payload = await res.json();
  return payload.data.map(flattenMovieObject);
}

//function for fetching a single film from API by id e.g. https://plankton-app-xhkom.ondigitalocean.app/api/movies/1
async function loadMovie(id) {
  const res = await fetch(API_BASE + "/movies/" + id);
  const payload = await res.json();
  return flattenMovieObject(payload.data);
}

async function loadPopularMovies() {
  const movies = await loadMovies();
  const ratings = await loadRatigs();

  const now = Date.now();
  const recentRatings = getPopularMovies(movies, ratings, now);
  return recentRatings;
}

async function loadRatigs() {
  const res = await fetch(API_BASE + "/reviews");
  const payload = await res.json();

  console.log("FULL FIRST REVIEW:", payload.data[0]);

  return payload.data.map(review => ({
    id: review.id,
    ...review.attributes,
  }));
}

async function loadReviewsByMovie(movieId, page = 1, pageSize = 5) {
  const params = new URLSearchParams();
  params.set("filters[movie]", String(movieId));
  params.set("pagination[page]", String(page));
  params.set("pagination[pageSize]", String(pageSize));

  const res = await fetch(`${API_BASE}/reviews?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to load all reviews (${res.status})`);
  }
  return res.json();
}

//correct function for processing JSON-data from Digital Ocean server for integration test
//transform API response structure (moves attributes from nested object to root level)
function flattenMovieObject(movie) {
  return {
    id: movie.id,
    ...movie.attributes, //spread all attributes to top level
  };
}

//Create Review in the CMS (POST /review)
async function createReview({ movieId, author, rating, comment }) {
  const res = await fetch(API_BASE + "/reviews", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      data: { movie: movieId, author, rating, comment },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CMS CreateReview failed: ${res.statusText} ${text}`);
  }
  const payload = await res.json();
  return { id: payload.data.id, ...payload.data?.attributes };
}

//prepare for exporting functions as en API-object to api.js
//cannot use 'export default' here if object is named (const api)
//if object-key and its meaning are same, they are conjoined to just one line
const api = {
  loadMovie,
  loadMovies,
  loadPopularMovies,
  loadRatigs,
  loadReviewsByMovie,
  createReview,
};

//pass variable api (object) to server.js
export default api;
