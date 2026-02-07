import getPopularMovies from "../server/popularMovies.js";

describe("getPopularMovies", () => {
    it("returns up to five movies based on ratings from the last 30 days", () => {
        const movies = [
            { id: 1, title: "Movie A"},
            { id: 2, title: "Movie B"},
            { id: 3, title: "Movie C"},
            { id: 4, title: "Movie D"},
            { id: 5, title: "Movie E"},
            { id: 6, title: "Movie F"},
        ]

        const now = Date.now();

        const reviews = [
            {movie: 1, rating: 5, createdAt: new Date(now).toISOString()},
            {movie: 1, rating: 4, createdAt: new Date(now).toISOString()},
            {movie: 2, rating: 3, createdAt: new Date(now).toISOString()},
            {movie: 3, rating: 5, createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString()},
            //this review should be ignored (older than 30 days)
            {movie: 4, rating: 5, createdAt: new Date(now - 40 * 24 * 60 * 60 * 1000).toISOString()},
        ]

        const result = getPopularMovies(movies, reviews);

        //only movies with recent ratings should be included
        expect(result.map(m => m.id)).toEqual([3, 1, 2]);

        //max 5 movies
        expect(result.length).toBeLessThanOrEqual(3);

        //average rating is calculated correctly
        const movieA = result.find(m => m.id === 1);

        expect(movieA.averageRating).toBe(4.5);
    })
})