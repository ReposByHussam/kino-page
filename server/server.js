import initApp from "./app.js";
import api from "./movies-backendAPI.js";
import { getMovieRating } from "./getMovieRating.js"; //refactor code to make integrationtest easier
api.getMovieRating = getMovieRating;//passing function as part of api object
const app = initApp(api);

app.listen(5080);