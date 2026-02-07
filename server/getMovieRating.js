/* LOGIK FÖR ATT FÅ UT KORREKT SNITTBETYG FÖR FILM*/

export async function getMovieRating(movieId, fetchJson, CMS_ORIGIN) {

  const CMS_REVIEWS_URL = `${CMS_ORIGIN}/api/reviews`;

  const params = new URLSearchParams();
  params.set("filters[movie]", String(movieId));
  const url = `${CMS_REVIEWS_URL}?${params.toString()}`;
  const json = await fetchJson(url);

  const reviews = Array.isArray(json?.data) ? json.data : [];

  let rating = null; //Startvärde för rating
  let source = null; //Vilken källa datan kommer ifrån

  if (reviews.length >= 5) {
    let total = 0;

    for (const review of reviews) {
      total += review.attributes.rating;
    }

    rating = Math.round((total / reviews.length) * 10) / 10;
    source = "cms";

  } else {
    const movieUrl = `${CMS_ORIGIN}/api/movies/${movieId}`;
    const movieJson = await fetchJson(movieUrl);

    const imdbId = movieJson?.data?.attributes?.imdbId; 
    
    //Ovan hämtar vi IMDB-id då detta behövs för att kunna hämta info från omdb
    //För att skicka request till omdbapi.com http://www.omdbapi.com/?apikey=[yourkey]&
    
    const OMDB_API_KEY = process.env.OMDB_API_KEY;

    //Return if the OMDB_API_KEY can't be found
    if (!OMDB_API_KEY){

      return {
        rating: null,
        source: "imdb",
        reviewCount: reviews.length,
        error: "OMDB_API_KEY is missing"
      };
    }

    const omdbUrl = `http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
    const omdbJson = await fetchJson(omdbUrl);

    rating = Number(omdbJson?.imdbRating) || null;
    source = "imdb";
  }

  return {
    rating: rating,
    source: source,
    reviewCount: reviews.length
  };
}