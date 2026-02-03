//frontend - loading dynamically upcoming screenings to a single movie page after page is rendered

export async function loadMovieScreenings() {
    //1. find container in content/movie.hbs <div id="screenings-container">
    const container = document.getElementById('screenings-container');

    //2. exit if container or movie ID (data-movie-id="{{movie.id}}") not found 
    // '?.' - chaining operator, returns undefined if container is null/undefined, 
    //'data-movie-id="{{movie.id}}': '.dataset' all DOM-element's data attributes: 'data-movie-id' -> dataset, {{movie.id}} -> camelCase 'movieID'
    //  combined checks
    const movieId = container?.dataset.movieId;
    if (!container || !movieId) {
        return
    };

    //3.fetch screenings data via our server API (that internally calls external API https://plankton-app-xhkom.ondigitalocean.app/api/screenings)
    try {
        // our REST endpoint: /api/movies/{movieId}/screenings
        const response = await fetch(`/api/movies/${movieId}/screenings`);

        //4. check if HTTP response status is OK, e.g. 200
        if (!response.ok) {
            console.error(`HTTP error loading screenings! Status: ${response.status}`);
            showErrorMessage(container, 'Kunde inte ladda visningar. Försök igen senare.');
            return;
        }

        //5. parse JSON response
        const data = await response.json();

        //6. check whether server response success flag
        // if server sent a definite mistake describption - show it, if didn't - show 'Okänt fel'
        //e.g. if response.ok = true (status 200), but {success: false, error: "Film hittades inte"} - in case of external server (Strapi): problem or JSON-data incorrect
        if (!data.success) {
            showErrorMessage(container, data.error || 'Okänt fel');
            return;
        }

        //7. check if data for upcoming screenings exist
        if (!data.data || data.data.length === 0) {
            showNoScreeningsMessage(container);
            return;
        }

        //8. display screenings in container
        displayScreenings(container, data.data);

    } catch (error) {
        // show info msg in case of problems with upcoming screenings loading 
        showErrorMessage(container, 'Kunde inte ladda visningar. Försök igen senare.');
    }
}


// HELPING FUNCTIONS
//Initialize screenings when DOM is ready (HTML is loaded - event DOMContentLoaded)
export function setupMovieScreenings() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadMovieScreenings);
    } else {
        loadMovieScreenings();
    }
}

//Show error message
function showErrorMessage(container, message) {
    //clear container first - for future if smth is added to the container
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    //create <p> element for error message
    const errorElement = document.createElement('p');
    errorElement.classList.add('error');
    errorElement.textContent = message;
    container.appendChild(errorElement);
}

//Show info message when no upcoming screenings found
function showNoScreeningsMessage(container) {
    //clear container first - for future if smth is added to the container
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    //create <p> element for info message
    const messageElement = document.createElement('p');
    messageElement.textContent = 'Inga kommande visningar för denna film';
    messageElement.classList.add('error');
    container.appendChild(messageElement);
}

//Display screenings list in container
function displayScreenings(container, screenings) {
    //clear container first - for future if smth is added to the container
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    //loop through each screening and create DOM elements
    screenings.forEach(screening => {
        const screeningItem = document.createElement('div');
        screeningItem.classList.add('screening-item');

        //create and format date/time element
        const timeElement = document.createElement('p');
        timeElement.classList.add('screening-time');

        //format date in Swedish locale with detailed options
        const startTime = new Date(screening.attributes.start_time);
        timeElement.textContent = startTime.toLocaleString('sv-SE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });

        //create room element
        const roomElement = document.createElement('p');
        roomElement.classList.add('screening-room');
        roomElement.textContent = screening.attributes.room || 'Okänd sal';

        //assemble screening item
        screeningItem.appendChild(timeElement);
        screeningItem.appendChild(roomElement);
        container.appendChild(screeningItem);
    });
}