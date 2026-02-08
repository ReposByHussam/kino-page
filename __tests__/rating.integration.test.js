import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import initApp from "../server/app.js";
import { getMovieRating as realGetMovieRating } from "../server/getMovieRating.js";

// Mock getMovieRating as we are only testing route handling
jest.mock("../server/getMovieRating.js", () => ({
  getMovieRating: jest.fn(),
}));

import { getMovieRating } from "../server/getMovieRating.js";

describe("GET /api/movies/:id/rating (integration)", () => {
  const mockApi = {
    loadMovies: async () => [],
    loadMovie: async () => ({}),
    createReview: async () => ({}),
  };

  let app;

  beforeEach(() => {
    app = initApp(mockApi);
    jest.clearAllMocks();
  });

  test("returns 502 if getMovieRating throws", async () => {
    getMovieRating.mockRejectedValueOnce(new Error("boom"));

    const res = await request(app)
      .get("/api/movies/8/rating")
      .expect(502);

    expect(res.body.error).toMatch(/aktuella betyg/i);
  });

  test("returns rating JSON for valid movie id (cms path)", async () => {
    getMovieRating.mockResolvedValueOnce({
      rating: 4.2,
      source: "cms",
      reviewCount: 7,
    });

    const res = await request(app)
      .get("/api/movies/8/rating")
      .expect("Content-Type", /json/)
      .expect(200);

    // route passes movieId as string from request params.id
    expect(getMovieRating).toHaveBeenCalledWith(
      "8",
      expect.any(Function),
      expect.any(String)
    );

    expect(res.body).toEqual({
      movieId: "8",
      rating: 4.2,
      source: "cms",
      reviewCount: 7,
    });
  });

  test("returns rating JSON for valid movie id (imdb path)", async () => {
    getMovieRating.mockResolvedValueOnce({
      rating: 8.9,
      source: "imdb",
      reviewCount: 2,
    });

    const res = await request(app)
      .get("/api/movies/5/rating")
      .expect(200);

    expect(getMovieRating).toHaveBeenCalledWith(
      "5",
      expect.any(Function),
      expect.any(String)
    );

    expect(res.body.movieId).toBe("5");
    expect(res.body.rating).toBe(8.9);
    expect(res.body.source).toBe("imdb");
    expect(res.body.reviewCount).toBe(2);
  });
});
