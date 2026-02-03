function getPopularMovies(movies, ratings, now) {
    const thirtyDays = 30*24*60*60*1000;
    const limitDate = new Date(now - thirtyDays);

    const recentRatings = ratings.filter(rating => {
        const ratingDate = new Date(rating.createdAt);
        return ratingDate >= limitDate
    });

    recentRatings.sort((a, b) => b.rating - a.rating);

    return recentRatings.slice(0, 5)
}

export default getPopularMovies;