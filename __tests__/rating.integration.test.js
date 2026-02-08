import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import initApp from "../server/app.js";
import { getMovieRating } from "../server/getMovieRating.js";
import { response } from "express";

/* Removing jest.mock requirement to test and circumvent the ESM require and import/export incompatiblity and error

Mock getMovieRating as we are only testing route handling
jest.mock("../server/getMovieRating.js", () => ({
  getMovieRating: jest.fn(),
}));
//removing jest.mock because of ESM module errors.

import { getMovieRating } from "../server/getMovieRating.js";

*/

describe("GET /api/movies/:id/rating (integration)", () => {

  //TEST 1 
  test('returns rating from mock API', async () => {
    const mockApi = {
      loadMovies: async () => [],
      loadMovie: async () => ({}),
      getMovieRating: async () => ({
        rating: 5.0,
        source: 'mock',
        reviewcount: 10
      }),
      createReview: async () => ({})
    };

  const app = initApp(mockApi);

  /*beforeEach(() => {
    app = initApp(mockApi);
    jest.clearAllMocks();
  });*/

  const response = await request(app)
  .get('/api/movies/8/rating')
  .expect(200);

  expect(response.body.rating).toBe(5.0);
        expect(response.body.source).toBe("mock");
    });

  //TEST 2
  test('returns 502 if getMovieRating throws', async () => {
    const mockApi = {
      loadMovies: async () => [],
      loadMovie: async () => ({}),
      createReview: async () => ({}),
      getMovieRating: async () => {
        throw new Error("Database connection failed");
    }};

    const app = initApp(mockApi);

    const response = await request(app)
      .get('/api/movies/8/rating')
      .expect(502); // Expect 502 Bad Gateway

    // Check that the error message matches what your app.js returns
    expect(response.body.error).toMatch(/Kunde inte hämta aktuella betyg/i);
  });

  //TEST 3
  test("returns rating JSON for valid movie id (cms path)", async () => {
    const mockApi = {
      loadMovies: async () => [],
      loadMovie: async () => ({}),
      createReview: async () => ({}),
      getMovieRating: async () => ({
        rating: 4.2,
        source: "cms",
        reviewCount: 7,
      })};
    const app = initApp(mockApi);
    const res = await request(app)
      .get("/api/movies/8/rating")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual({
      movieId: "8",
      rating: 4.2,
      source: "cms",
      reviewCount: 7,
    });
  });

  //TEST 4
  test("returns rating JSON for valid movie id (imdb path)", async () => {
    const mockApi = {
      loadMovies: async () => [],
      loadMovie: async () => ({}),
      createReview: async () => ({}),
      getMovieRating: async () => ({
        rating: 6.7,
        source: "imdb",
        reviewCount: 2,
      })};
    const app = initApp(mockApi);
    const res = await request(app)
      .get("/api/movies/5/rating")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual({
      movieId: "5",
      rating: 6.7,
      source: "imdb",
      reviewCount: 2,
    });
  });

});
