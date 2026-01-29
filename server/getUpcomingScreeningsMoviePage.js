//server logic function for filtering upcoming screenings on a single movie page
export default function getUpcomingScreeningsMoviePage(screenings) {
    const now = new Date();
    
    //if no screenings are found
     if (!Array.isArray(screenings)) {
        return [];
     }

     //only UPCOMINGS screenings
    const upcomingScreenings  = screenings
    .filter(screening => {
        const screeningDate = new Date(screening.attributes.start_time);

        return screeningDate > now;
    });

    return upcomingScreenings;
}

