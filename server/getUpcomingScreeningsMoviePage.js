//server logic function for filtering upcoming screenings on a single movie page
export default function getUpcomingScreeningsMoviePage(screenings) {
    const now = new Date(); //!!!! 'const now =new Date('2024-01-01T00:00:00Z')' -  testing past date that shows screenings from API, for real date must be const now = new Date();
    
    //if no screenings are found
     if (!Array.isArray(screenings)) {
        return [];
     }

     //only UPCOMINGS screenings
    const upcomingScreenings  = screenings
    .filter(screening => {
        const screeningDate = new Date(screening.attributes.start_time);

        return screeningDate > now;
    })
    .sort((screeingA, screeningB) => {  //sorting in ascending order
            const dateA = new Date(screeingA.attributes.start_time);
            const dateB = new Date(screeningB.attributes.start_time);
            return dateA - dateB;  // 'dateA - dateB = positive number' ->  b before a (ascending order)
        });

    return upcomingScreenings;
}

