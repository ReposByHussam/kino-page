import express from "express";
import renderPage from "./renderPage.js";

export default function initApp(api) {
  const app = express();

  // statiska filer (css, bilder, js osv)
  app.use("/src", express.static("./src"));

  // behövs när vi senare vill ta emot JSON i POST (reviews)
  app.use(express.json());

  // CMS (Strapi)
  const CMS_ORIGIN = "https://plankton-app-xhkom.ondigitalocean.app";
  const CMS_REVIEWS_URL = `${CMS_ORIGIN}/api/reviews`;

  // liten helper för att hämta JSON
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

  // gör om query-värden till rimliga heltal
  function clampInt(value, fallback, { min = 1, max = 999 } = {}) {
    const n = Number.parseInt(value, 10);
    if (Number.isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  // startsidan (SSR)
  app.get("/", async (req, res) => {
    try {
      const movies = await api.loadMovies();
      const htmlText = await renderPage("index", { movies });
      res.send(htmlText);
    } catch (error) {
      console.error("Error loading movies:", error);
      const htmlText = await renderPage("index", { movies: [] });
      res.send(htmlText);
    }
  });

  // vanliga sidor (SSR)
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

  // alla filmer (SSR)
  app.get("/movies", async (req, res) => {
    try {
      const movies = await api.loadMovies();
      res.send(await renderPage("movies", { movies }));
    } catch (error) {
      console.error("Error loading movies:", error);
      res.status(500).send("Kunde inte ladda filmerna");
    }
  });

  // en film (SSR)
  app.get("/movies/:movieId", async (req, res) => {
    try {
      const movie = await api.loadMovie(req.params.movieId);
      res.send(await renderPage("movie", { movie }));
    } catch (error) {
      console.error(`Error loading movie ${req.params.movieId}:`, error);
      res.status(404).send("Film hittades inte");
    }
  });

  // API som frontend kan fetcha efter att sidan laddats
  // ex: /api/movies/1/reviews?page=1&pageSize=5
  app.get("/api/movies/:movieId/reviews", async (req, res) => {
    const movieId = req.params.movieId;

    // vi kör max 5 per sida enligt kravet
    const page = clampInt(req.query.page, 1, { min: 1, max: 9999 });
    const pageSize = clampInt(req.query.pageSize, 5, { min: 1, max: 5 });

    try {
      const params = new URLSearchParams();
      params.set("filters[movie]", movieId);
      params.set("pagination[page]", String(page));
      params.set("pagination[pageSize]", String(pageSize));
      params.set("sort[0]", "createdAt:desc"); // nyast först

      const url = `${CMS_REVIEWS_URL}?${params.toString()}`;
      const json = await fetchJson(url);

      const items = Array.isArray(json?.data) ? json.data : [];
      const pg = json?.meta?.pagination || {};

      // gör datan lite enklare för frontend
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

  // fallback
  app.use((req, res) => {
    res.status(404).send("Page is not found");
  });

  return app;
}