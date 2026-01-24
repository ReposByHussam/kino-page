import fetch from "node-fetch"; //HTTP-request module for Node.js (not available in browser)

const API_BASE = 'https://plankton-app-xhkom.ondigitalocean.app/api';

//function for fetching all movies from API https://plankton-app-xhkom.ondigitalocean.app/api/movies
async function loadMovies() {
  const res = await fetch(API_BASE + '/movies');
  const payload = await res.json();
  return payload.data.map(flattenMovieObject);
}

//function for fetching a single film from API by id e.g. https://plankton-app-xhkom.ondigitalocean.app/api/movies/1
async function loadMovie(id) {
  const res = await fetch(API_BASE + '/movies/' + id);
  const payload = await res.json();
  return flattenMovieObject(payload.data);
}

//correct function for processing JSON-data from Digital Ocean server for integration test
//transform API response structure (moves attributes from nested object to root level)
function flattenMovieObject(movie) {
  return {
    id: movie.id,
    ...movie.attributes,  //spread all attributes to top level
  };
}

//prepare for exporting functions as en API-object to api.js
//cannot use 'export default' here if object is named (const api)
//if object-key and its meaning are same, they are conjoined to just one line
const api = {
  loadMovie,
  loadMovies,
};

//pass variable api (object) to server.js 
export default api;
