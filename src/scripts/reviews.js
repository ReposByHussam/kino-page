// src/scripts/reviews.js
// Jag visar recensioner på filmsidan: 5 per sida + nästa/föregående-knappar

const PAGE_SIZE = 5;

// Jag försöker hitta film-id (först från data-attribute, annars från URL:en)
function getMovieId() {
  const container = document.querySelector("#reviews");
  const fromData = container?.dataset?.movieId;
  if (fromData) return fromData;

  const match = window.location.pathname.match(/\/movies\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Jag normaliserar svaret så jag kan jobba med samma format oavsett API-struktur
function normalizeResponse(json) {
  // Vårt API-format: { reviews: [...], pagination: {...} }
  if (json && Array.isArray(json.reviews)) {
    const p = json.pagination || {};
    const page = Number(p.page || 1);
    const pageSize = Number(p.pageSize || PAGE_SIZE);
    const pageCount = Number(p.pageCount || 1);
    const total = Number(p.total || json.reviews.length);

    return {
      reviews: json.reviews,
      page,
      pageSize,
      pageCount: pageCount > 0 ? pageCount : 1,
      total,
    };
  }

  // Strapi/CMS-format: { data: [...], meta: { pagination: {...} } }
  if (json && Array.isArray(json.data)) {
    const p = json.meta?.pagination || {};
    const page = Number(p.page || 1);
    const pageSize = Number(p.pageSize || PAGE_SIZE);
    const pageCount = Number(p.pageCount || 1);
    const total = Number(p.total || json.data.length);

    return {
      reviews: json.data,
      page,
      pageSize,
      pageCount: pageCount > 0 ? pageCount : 1,
      total,
    };
  }

  // Om jag råkar få en array direkt så gör jag den kompatibel
  if (Array.isArray(json)) {
    return {
      reviews: json,
      page: 1,
      pageSize: PAGE_SIZE,
      pageCount: 1,
      total: json.length,
    };
  }

  // Sista fallback: tomt men stabilt format
  return { reviews: [], page: 1, pageSize: PAGE_SIZE, pageCount: 1, total: 0 };
}

// Jag skyddar mig mot att någon försöker stoppa in HTML i texten
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderStars(rating) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  return "★".repeat(r) + "☆".repeat(5 - r);
}

// Jag ser till att UI finns (skapar om det inte redan finns)
function ensureUi() {
  const container = document.querySelector("#reviews");
  if (!container) return null;

  let list = container.querySelector("#reviewsList");
  let status = container.querySelector("#reviewsStatus");
  let prevBtn = container.querySelector("#reviewsPrev");
  let nextBtn = container.querySelector("#reviewsNext");
  let pageLabel = container.querySelector("#reviewsPageLabel");

  if (!list) {
    container.innerHTML = `
      <section class="reviews-block" style="max-width: 900px; margin: 24px auto; text-align:left;">
        <h2 style="margin: 0 0 12px 0;">Recensioner</h2>
        <p id="reviewsStatus" style="margin: 0 0 12px 0;">Laddar recensioner...</p>

        <div id="reviewsList" style="display:grid; gap:12px;"></div>

        <div style="display:flex; gap:10px; align-items:center; margin-top: 14px;">
          <button id="reviewsPrev" class="btn btn--primary" type="button">Föregående</button>
          <span id="reviewsPageLabel" style="font-size: 0.95rem;"></span>
          <button id="reviewsNext" class="btn btn--primary" type="button">Nästa</button>
        </div>
      </section>
    `;

    list = container.querySelector("#reviewsList");
    status = container.querySelector("#reviewsStatus");
    prevBtn = container.querySelector("#reviewsPrev");
    nextBtn = container.querySelector("#reviewsNext");
    pageLabel = container.querySelector("#reviewsPageLabel");
  }

  return { list, status, prevBtn, nextBtn, pageLabel };
}

// Jag hämtar recensioner via vår server (inte direkt från CMS)
async function fetchReviews(movieId, page) {
  const url = `/api/movies/${encodeURIComponent(
    movieId
  )}/reviews?page=${page}&pageSize=${PAGE_SIZE}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`HTTP ${res.status}`);
    err.body = text;
    throw err;
  }

  return res.json();
}

// Jag renderar själva listan med recensioner i DOM:en
function renderReviews(ui, reviews) {
  if (!reviews.length) {
    ui.list.innerHTML = `<p style="margin:0;">Inga recensioner ännu.</p>`;
    return;
  }

  ui.list.innerHTML = reviews
    .map((r) => {
      const name = r.name ?? r.author ?? "Anonym";
      const comment = r.comment ?? r.text ?? "";
      const rating = r.rating ?? r.stars ?? 0;

      return `
        <article style="border:1px solid #ddd; border-radius:10px; padding:12px;">
          <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
            <strong>${escapeHtml(name)}</strong>
            <span aria-label="Betyg ${rating} av 5">${renderStars(rating)}</span>
          </div>
          <p style="margin:10px 0 0 0;">${escapeHtml(comment)}</p>
        </article>
      `;
    })
    .join("");
}

// Jag uppdaterar knappar + sidinfo så pagination känns tydlig
function updatePaginationUi(ui, page, pageCount, total) {
  ui.pageLabel.textContent = `Sida ${page} av ${pageCount} (${total} st)`;

  ui.prevBtn.disabled = page <= 1;
  ui.nextBtn.disabled = page >= pageCount;

  ui.prevBtn.style.opacity = ui.prevBtn.disabled ? "0.5" : "1";
  ui.nextBtn.style.opacity = ui.nextBtn.disabled ? "0.5" : "1";
}

// Jag laddar data + renderar, och hanterar fel snyggt
async function loadAndRender(ui, movieId, state) {
  ui.status.textContent = "Laddar recensioner...";
  ui.status.style.color = "";

  try {
    const json = await fetchReviews(movieId, state.page);
    const { reviews, page, pageCount, total } = normalizeResponse(json);

    // Jag litar på serverns pagination-värden (så jag inte gissar)
    state.page = page;
    state.pageCount = pageCount;

    renderReviews(ui, reviews);
    updatePaginationUi(ui, state.page, state.pageCount, total);

    ui.status.textContent = "";
  } catch (err) {
    console.error("Reviews error:", err);

    ui.list.innerHTML = "";
    ui.pageLabel.textContent = "";
    ui.prevBtn.disabled = true;
    ui.nextBtn.disabled = true;

    ui.status.textContent = "Kunde inte ladda recensioner just nu.";
    ui.status.style.color = "crimson";
  }
}

// Jag startar allt när sidan är klar
document.addEventListener("DOMContentLoaded", () => {
  const ui = ensureUi();
  if (!ui) return;

  const movieId = getMovieId();
  if (!movieId) {
    ui.status.textContent = "Kunde inte hitta film-id.";
    ui.status.style.color = "crimson";
    return;
  }

  const state = { page: 1, pageCount: 1 };

  ui.prevBtn.addEventListener("click", () => {
    if (state.page > 1) {
      state.page -= 1;
      loadAndRender(ui, movieId, state);
    }
  });

  ui.nextBtn.addEventListener("click", () => {
    if (state.page < state.pageCount) {
      state.page += 1;
      loadAndRender(ui, movieId, state);
    }
  });

  // Jag laddar första sidan direkt
  loadAndRender(ui, movieId, state);
});