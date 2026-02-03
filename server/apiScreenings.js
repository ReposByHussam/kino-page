import fetch from "node-fetch";
import getUpcomingScreeningsMoviePage from "./getUpcomingScreeningsMoviePage.js";

async function loadAllScreenings() {
    const response = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/screenings');
    const payload = await response.json();

    return payload.data;
}

async function loadScreeningsByMovieId(movieId) {

    //DOCUMENTATION Strapi for GET request https://plankton-app-xhkom.ondigitalocean.app/documentation/v1.0.0#/Screening/get_screenings
    const url = `https://plankton-app-xhkom.ondigitalocean.app/api/screenings?filters[movie]=${movieId}&populate=movie&sort=start_time:asc`;
    // 1. filters[movie]=${movieId} -> filter screenings by movie ID
    // 2. populate=movie -> include movie's details in response 
    // 3. sort=start_time:asc -> sort by screening date (ascending= earliest first)  
    const response = await fetch(url);
    const payload = await response.json();

    return payload.data;
}
//named objects cannot be 'export default'
const apiScreenings = {
    loadAllScreenings,
    loadScreeningsByMovieId,
    getUpcomingScreeningsMoviePage, // import filtering logic for upcoming screenings
}

export default apiScreenings;