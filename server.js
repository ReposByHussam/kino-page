const fs = require("fs");
const fsp = require("fs/promises");
const express = require("express");
const path = require("path");

const app = express();
const PORT = 5080;

const API_ORIGIN = "https://plankton-app-xhkom.ondigitalocean.app";
const API_LIST = `${API_ORIGIN}/api/movies`;
const API_ONE = (id) => `${API_ORIGIN}/api/movies/${encodeURIComponent(id)}`;

const UPCOMING_JSON_PATH = path.join(__dirname, "src", "data", "future-movies.json");

app.use(express.static(__dirname));
app.use("/src", express.static(path.join(__dirname, "src")));

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function wrap(title, body) {
  return `<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/src/styles/main.css">
</head>
<body>
  <div style="padding:16px;">
    <p>
      <a href="/">Start</a> |
      <a href="/movies">Filmer</a> |
      <a href="/upcoming">Kommande</a>
    </p>
    ${body}
  </div>
</body>
</html>`;
}

async function fetchJson(url) {
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await r.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {
    const err = new Error("JSON_PARSE_ERROR");
    err.status = r.status;
    err.bodyPreview = text.slice(0, 800);
    throw err;
  }
  return { status: r.status, ok: r.ok, json, bodyPreview: text.slice(0, 800) };
}

function normalizeList(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
}

function normalizeOne(json) {
  return json && json.data ? json.data : json;
}

function toAbsoluteUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_ORIGIN}${url}`;
  return url;
}

function getFieldsFromApiMovie(movie) {
  const attrs = movie?.attributes ?? movie ?? {};
  const title = attrs.title ?? "Okänd titel";
  const intro = attrs.intro ?? attrs.description ?? "";

  const nested =
    attrs.image?.data?.attributes?.url ||
    attrs.poster?.data?.attributes?.url ||
    attrs.cover?.data?.attributes?.url ||
    attrs.thumbnail?.data?.attributes?.url ||
    "";

  const flat =
    attrs.imageUrl ||
    attrs.image ||
    attrs.posterUrl ||
    attrs.poster ||
    attrs.img ||
    "";

  const image = toAbsoluteUrl(nested || flat) || "/src/placeholders/placeholder.png";
  return { title, intro, image };
}

function getFieldsFromLocalMovie(movie) {
  const title = movie?.title ?? movie?.name ?? "Okänd titel";
  const intro = movie?.intro ?? movie?.description ?? movie?.plot ?? movie?.summary ?? "";
  const image =
    movie?.imageUrl ||
    movie?.image ||
    movie?.posterUrl ||
    movie?.poster ||
    movie?.img ||
    "/src/placeholders/placeholder.png";
  return { title, intro, image };
}

function truncate(str = "", max = 180) {
  const s = String(str || "").trim();
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

async function readUpcomingJson() {
  const raw = await fsp.readFile(UPCOMING_JSON_PATH, "utf-8");
  const json = JSON.parse(raw);
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.movies)) return json.movies;
  return [];
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/movies", async (req, res) => {
  try {
    const { ok, status, json, bodyPreview } = await fetchJson(API_LIST);

    if (!ok) {
      return res.status(502).send(
        wrap(
          "Fel",
          `<h1>Fel</h1>
           <p>API svarade med status ${status}</p>
           <pre>${escapeHtml(bodyPreview)}</pre>`
        )
      );
    }

    const movies = normalizeList(json);

    const cards = movies
      .map((m) => {
        const rawId = m?.id;
        const id =
          typeof rawId === "number" || typeof rawId === "string" ? String(rawId) : "";

        const { title, intro, image } = getFieldsFromApiMovie(m);

        return `<article style="border:1px solid #ddd;border-radius:10px;padding:12px;">
  <h2 style="margin:0 0 8px 0;">${escapeHtml(title)}</h2>
  <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" style="max-width:100%;height:auto;border-radius:8px;" />
  <p style="margin:10px 0;">${escapeHtml(truncate(intro, 220))}</p>
  <p style="margin:0;"><a href="/movies/${encodeURIComponent(id)}">Läs mer</a></p>
</article>`;
      })
      .join("");

    const grid = `<h1>Filmer</h1>
<div style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
  ${cards}
</div>`;

    res.send(wrap("Filmer", grid));
  } catch (err) {
    res.status(500).send(
      wrap(
        "Serverfel",
        `<h1>Serverfel</h1>
         <p>${escapeHtml(err.message || "Okänt fel")}</p>
         ${err.bodyPreview ? `<pre>${escapeHtml(err.bodyPreview)}</pre>` : ""}`
      )
    );
  }
});

app.get("/movies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { ok, status, json, bodyPreview } = await fetchJson(API_ONE(id));

    if (status === 404) {
      return res.status(404).send(
        wrap(
          "Hittades inte",
          `<h1>Filmen finns inte</h1>
           <p>ID: ${escapeHtml(id)}</p>
           <p><a href="/movies">← Tillbaka</a></p>`
        )
      );
    }

    if (!ok) {
      return res.status(502).send(
        wrap(
          "Fel",
          `<h1>Fel</h1>
           <p>API svarade med status ${status}</p>
           <pre>${escapeHtml(bodyPreview)}</pre>`
        )
      );
    }

    const movie = normalizeOne(json);
    const { title, intro, image } = getFieldsFromApiMovie(movie);

    res.send(
      wrap(
        title,
        `<h1>${escapeHtml(title)}</h1>
         <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" style="max-width:420px;width:100%;height:auto;" />
         <p style="margin-top:12px;">${escapeHtml(intro)}</p>
         <p><a href="/movies">← Tillbaka</a></p>`
      )
    );
  } catch (err) {
    res.status(500).send(
      wrap(
        "Serverfel",
        `<h1>Serverfel</h1>
         <p>${escapeHtml(err.message || "Okänt fel")}</p>
         ${err.bodyPreview ? `<pre>${escapeHtml(err.bodyPreview)}</pre>` : ""}`
      )
    );
  }
});

app.get("/upcoming", async (req, res) => {
  try {
    const list = await readUpcomingJson();

    const cards = list
      .map((m, idx) => {
        const id = m?.id ?? m?._id ?? m?.slug ?? String(idx);
        const { title, intro, image } = getFieldsFromLocalMovie(m);

        return `<article style="border:1px solid #ddd;border-radius:10px;padding:12px;">
  <h2 style="margin:0 0 8px 0;">${escapeHtml(title)}</h2>
  <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" style="max-width:100%;height:auto;border-radius:8px;" />
  <p style="margin:10px 0;">${escapeHtml(truncate(intro, 220))}</p>
  <p style="margin:0;"><a href="/upcoming/${encodeURIComponent(String(id))}">Läs mer</a></p>
</article>`;
      })
      .join("");

    const grid = `<h1>Kommande filmer</h1>
<div style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
  ${cards || "<p>Inga kommande filmer hittades i JSON-filen.</p>"}
</div>`;

    res.send(wrap("Kommande filmer", grid));
  } catch (err) {
    res.status(500).send(
      wrap(
        "Serverfel",
        `<h1>Serverfel</h1>
         <p>${escapeHtml(err.message || "Okänt fel")}</p>
         <p>Kontrollera att filen finns här:</p>
         <pre>${escapeHtml(UPCOMING_JSON_PATH)}</pre>`
      )
    );
  }
});

app.get("/upcoming/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const list = await readUpcomingJson();

    const found =
      list.find((m) => String(m?.id) === id) ||
      list.find((m) => String(m?._id) === id) ||
      list.find((m) => String(m?.slug) === id) ||
      list[Number.isFinite(Number(id)) ? Number(id) : -1];

    if (!found) {
      return res.status(404).send(
        wrap(
          "Hittades inte",
          `<h1>Kommande film finns inte</h1>
           <p>ID: ${escapeHtml(id)}</p>
           <p><a href="/upcoming">← Tillbaka</a></p>`
        )
      );
    }

    const { title, intro, image } = getFieldsFromLocalMovie(found);

    res.send(
      wrap(
        title,
        `<h1>${escapeHtml(title)}</h1>
         <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" style="max-width:420px;width:100%;height:auto;" />
         <p style="margin-top:12px;">${escapeHtml(intro)}</p>
         <p><a href="/upcoming">← Tillbaka</a></p>`
      )
    );
  } catch (err) {
    res.status(500).send(
      wrap(
        "Serverfel",
        `<h1>Serverfel</h1>
         <p>${escapeHtml(err.message || "Okänt fel")}</p>`
      )
    );
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "index.html"));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Kino kör på http://localhost:${PORT}`);
  });
}

module.exports = app;