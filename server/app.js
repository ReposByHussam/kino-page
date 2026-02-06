import express from "express";
import renderPage from "./renderPage.js";
import apiScreenings from "./apiScreenings.js";
import { getScreenings } from './getUpcomingScreenings.js';

export default function initApp(api) {
  const app = express();

  //Allow Express to parse JSON in request body fromm fetch()
  app.use(express.json());

  //1) ROUTE TO STATIC FILES
  //route to static files .use('/folderName', express.static('./folderName')) should go before dynamic routes app.get(), otherwise it'll not be read
  //'/src' - absolute route from the project root
  //'./src' - relative route from the folderName
  app.use("/src", express.static("./src"));

  //2) DYNAMIC ROUTES: SSR - render layout and get it
  // SSR - start page
  app.get("/", async (req, res) => {
    try {
      const movies = await api.loadMovies();
      const htmlText = await renderPage("index", { movies }); //{movies} - object with data from API-JSON
      res.send(htmlText);
    } catch (error) {
      console.error("Error loading movies:", error);
      const htmlText = await renderPage("index", { movies: [] }); //if { movies } empty
      res.send(htmlText);
    }
  });


  // CMS (Strapi) – härifrån hämtas recensionerna
  const CMS_ORIGIN = "https://plankton-app-xhkom.ondigitalocean.app";
  const CMS_REVIEWS_URL = `${CMS_ORIGIN}/api/reviews`;

  // Min lilla helper: hämtar JSON och ger bra fel om något strular
  async function fetchJson(url) {
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    const text = await r.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      const err = new Error("JSON_PARSE_ERROR");
      err.status = r.status;
      err.bodyPreview = text.slice(0, 800);
      throw err;
    }

    if (!r.ok) {
      const err = new Error(`CMS_ERROR_${r.status}`);
      err.status = r.status;
      err.bodyPreview = text.slice(0, 800);
      throw err;
    }

    return json;
  }

  // Jag gör om query-parametrar till rimliga heltal (så ingen kan krascha med konstiga värden)
  function clampInt(value, fallback, { min = 1, max = 999 } = {}) {
    const n = Number.parseInt(value, 10);
    if (Number.isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }



  // Endpoint för kommande visningar på filmsidan
  app.get("/api/movies/:movieId/screenings", async (req, res) => {
    try {
      const movieId = req.params.movieId;

      // 1) Jag hämtar alla visningar för filmens id
      const screenings = await apiScreenings.loadScreeningsByMovieId(movieId);

      // 2) Sen plockar jag bara ut de som är i framtiden (kommande visningar)
      const upcomingScreenings =
        apiScreenings.getUpcomingScreeningsMoviePage(screenings);

      // 3) Skickar tillbaka som JSON till frontend
      res.status(200).json({
        success: true,
        data: upcomingScreenings,
      });
    } catch (error) {
      console.error("ERROR:", error);
      res.status(500).json({
        success: false,
        error: "Kunde inte ladda visningar",
      });
    }
  });

  // Vanliga sidor (SSR)
  app.get("/about-us", async (req, res) => {
    res.send(await renderPage("about-us"));
  });

  app.get("/bistro", async (req, res) => {
    res.send(await renderPage("bistro"));
  });

  app.get("/contact", async (req, res) => {
    res.send(await renderPage("contact"));
  });

  app.get("/eventPage", async (req, res) => {
    res.send(await renderPage("eventPage"));
  });

  // Lista alla filmer (SSR)
  app.get("/movies", async (req, res) => {
    try {
      const movies = await api.loadMovies();
      res.send(await renderPage("movies", { movies }));
    } catch (error) {
      console.error("Error loading movies:", error);
      res.status(500).send("Kunde inte ladda filmerna");
    }
  });

  // En specifik film (SSR)
  app.get("/movies/:movieId", async (req, res) => {
    try {
      const movie = await api.loadMovie(req.params.movieId);
      res.send(await renderPage("movie", { movie }));
    } catch (error) {
      console.error(`Error loading movie ${req.params.movieId}:`, error);
      res.status(404).send("Film hittades inte");
    }
  });

  // Reviews-API som frontend hämtar efter att sidan laddats
  // Ex: /api/movies/1/reviews?page=1&pageSize=5
  app.get("/api/movies/:movieId/reviews", async (req, res) => {
    const movieId = req.params.movieId;

    // Kravet är max 5 per sida, så jag låser pageSize till 5
    const page = clampInt(req.query.page, 1, { min: 1, max: 9999 });
    const pageSize = clampInt(req.query.pageSize, 5, { min: 1, max: 5 });

    try {
      const params = new URLSearchParams();
      params.set("filters[movie]", movieId);
      params.set("pagination[page]", String(page));
      params.set("pagination[pageSize]", String(pageSize));
      params.set("sort[0]", "createdAt:desc"); // jag vill visa nyast först

      const url = `${CMS_REVIEWS_URL}?${params.toString()}`;
      const json = await fetchJson(url);

      const items = Array.isArray(json?.data) ? json.data : [];
      const pg = json?.meta?.pagination || {};

      // Jag mappar om datan till ett enklare format så frontend slipper hålla på med Strapi-strukturen
      const reviews = items.map((item) => {
        const a = item?.attributes || {};
        return {
          id: item?.id,
          name: a?.name ?? a?.author ?? "Okänd",
          rating: a?.rating ?? a?.score ?? null,
          comment: a?.comment ?? a?.text ?? "",
          createdAt: a?.createdAt ?? null,
        };
      });

      res.json({
        reviews,
        pagination: {
          page: pg.page ?? page,
          pageSize: pg.pageSize ?? pageSize,
          pageCount: pg.pageCount ?? null,
          total: pg.total ?? null,
        },
      });
    } catch (error) {
      console.error("Error loading reviews:", error);
      res.status(502).json({ error: "Kunde inte hämta recensioner just nu" });
    }
  });

app.post("/api/movies/:movieId/reviews", async (req, res) => {
    const movieId = Number(req.params.movieId);
    const author =
      typeof req.body?.author === "string" ? req.body.author.trim() : "";
    const comment =
      typeof req.body?.comment === "string" ? req.body.comment.trim() : "";
    const rating = Number(req.body?.rating);

    if (!Number.isFinite(movieId) || movieId <= 0) {
      return res.status(400).json({ error: "Ogiltigt film-ID" });
    }
    if (!author) {
      return res.status(400).json({ error: "Du måste ange ett namn." });
    }
    if (!Number.isFinite(rating) || !Number.isInteger(rating) || rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Betyget måste vara ett heltal mellan 0 och 5." });
    }
    try {
      const created = await api.createReview({
        movieId,
        author,
        rating,
        comment,
      });
      return res.status(201).json({ created });
    } catch (error) {
      console.error("Error creating review:", error);
      return res
        .status(502)
        .json({ error: "Kunde inte spara recensionen, försök igen senare." });
    }
  });    
  app.get('/api/upcoming-screenings', async (req, res) => {
      try {
          const screenings = await getScreenings();
          res.status(200).json({
              data: screenings,
          });
      } catch (err) {
          res.status(500).json({
              error: {
                  message: 'Failed to load upcoming screenings',
              },
          });
      }
  });

  //Endpoint för att hämta enskild films betyg
  app.get('/api/movies/:id/rating', async (req, res) => {
    try {
      const movieId = req.params.id;
      const result = await getMovieRating(movieId, fetchJson, CMS_ORIGIN);

      res.json({
        movieId,
        ...result,
      });

    } catch (error) {
      console.error("Couldn't fetch reviews of movies", error);
      res.status(502).json({ error: 'Kunde inte hämta aktuella betyg' });
    }
  });

  // Fallback (måste ligga sist) – om ingen route matchar
  app.use((req, res) => {
    res.status(404).send("Page is not found");
  });

  return app;
}

