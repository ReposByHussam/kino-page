const request = require("supertest");
const app = require("../server");

const API_LIST = "https://plankton-app-xhkom.ondigitalocean.app/api/movies";

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function pickTitle(m) {
  const attrs = m?.attributes ?? m ?? {};
  return attrs.title ?? "Okänd titel";
}

describe("SSR movies", () => {
  test("filmsida visar rätt titel", async () => {
    const apiRes = await fetch(API_LIST, { headers: { Accept: "application/json" } });
    expect(apiRes.ok).toBe(true);

    const json = await apiRes.json();
    const movies = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
    expect(movies.length).toBeGreaterThan(0);

    const first = movies[0];
    const id = String(first.id);
    const title = pickTitle(first);

    const res = await request(app).get(`/movies/${encodeURIComponent(id)}`);
    expect(res.status).toBe(200);
    expect(res.text).toContain(`<h1>${escapeHtml(title)}</h1>`);
  });
});