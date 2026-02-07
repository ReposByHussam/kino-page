//calculates the five most popular movies based on ratings from the last 30 days
export default function getPopularMovies(movies, reviews) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const ratingsByMovie = {};

    for (const review of reviews) {
        if (new Date(review.createdAt) < cutoff) continue;

        if (!ratingsByMovie[review.movie]) {
            ratingsByMovie[review.movie] = [];
        }

        ratingsByMovie[review.movie].push(review.rating);
    }

    //exclude movies without ratings
    //calculate average rating per movie
    return movies
        .filter(movie => ratingsByMovie[movie.id]?.length)
        .map(movie => {
            const ratings = ratingsByMovie[movie.id];
            const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;

            return {
                id: movie.id,
                title: movie.title,
                image: movie.image,
                averageRating: Number(avg.toFixed(2)),
            };
        })
        //sort by highest avg rating and limit result to 5 movies
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 5);
}