# kino-page
Grupparbeta KINO grupp B

## SERVER
Efter ’npm install’ går sidan att besöka på  http://localhost:5080 med ’npm start’.

Tillgång till alla filmer finns på startsidan / (rotvägen) som en lista.

Sidan /movies med kort av alla filmer är tillgänglig från startsidan på flera sätt:

från huvudmenyn  ”Aktuella filmer”  -> ”Alla filmer” (endast desktop: skärmar 900px och större),
från footermenyn  ”Filmer idag”  -> ”Alla filmer” (endast mobil/ platta:  skärmar 599px och mindre),
från knappen ”Alla aktuella filmer” under filmlistan på startsidan (alla skärmstorlekar).
Dessutom finns det tillgång från en enskild filmsida via knappen ”Tillbaka till alla filmer”
Alla filmkort på sidan /movies innehåller filmtitel, filmbild och knappen ”Läs mer” som leder till den enskilda filmens sida /movies/:id (t.ex. /movies/1)


## UPPGIFT 3 - GRUPPUPGIFT

# PART 1 - Upcoming Screenings API

## Domain Objects
### Screening
Represents a single movie screening event.

Example:

```{ "startTime": "2025-03-17T12:00:00.000Z", "room": "Stora salongen" }```

### Grouped Screenings
Screenings grouped by day.

`date` is a date string representing a day in Europe/Stockholm timezone.

Example:

```[
  {
    "date": "2025-03-17",
    "screenings": [
      { "startTime": "2025-03-17T12:00:00.000Z", "room": "Stora salongen" },
      { "startTime": "2025-03-17T17:00:00.000Z", "room": "Stora salongen" }
    ]
  }
]
```

## API Endpoint
### Upcoming Screenings

### Request
Method: GET

Endpoint: /api/upcoming-screenings

“Upcoming” is determined using the Stockholm timezone.

Screenings are grouped by calendar day (Stockholm time).

Example Request (cURL):

```curl -X GET http://localhost:5080/api/upcoming-screenings```

### Response
#### 200 OK

Returns a JSON object containing a data array of GroupedScreenings.

If no upcoming screenings are found, an empty array is returned.

Days are sorted by date ascending.

Example Response:
```{
  "data": [
    {
      "date": "2025-03-17",
      "screenings": [
        { "startTime": "2025-03-17T12:00:00.000Z", "room": "Stora salongen" },
        { "startTime": "2025-03-17T17:00:00.000Z", "room": "Stora salongen" },
        { "startTime": "2025-03-17T21:00:00.000Z", "room": "Stora salongen" }
      ]
    }
  ]
}
```
#### 500 Internal Server Error

```{
  "error": {
    "message": "Failed to load upcoming screenings"
  }
```
Backend logic described in [#140](https://github.com/ReposByHussam/kino-page/pull/140)

## Frontend Usage
API can be consumed in browser to display upcoming screenings.

Example JavaScript:

```import { setupUpcomingScreenings } from './upcomingScreenings.js';```

```setupUpcomingScreenings();```

HTML:

```<div class="upcoming-screenings__list"></div>```


Screenings are grouped by day:

```<h3>``` for date

```<p>``` for each screening

Rendering Example:

<div class="upcoming-screenings__day">
  <h3 class="upcoming-screenings__date">måndag 17 mars</h3>
  <p class="upcoming-screenings__screening">12:00 - Stora salongen</p>
  <p class="upcoming-screenings__screening">17:00 - Stora salongen</p>
  <p class="upcoming-screenings__screening">21:00 - Stora salongen</p>
</div>



# PART 3 -Upcoming Movie Screenings

### Server API Endpoint
GET /api/movies/:movieId/screenings
Returns upcoming screenings for a single movie. All filtering happens on the server side.

#### Server Implementation
Route handler in server/app.js:

app.get("/api/movies/:movieId/screenings", async (req, res) => {
  ...
});


#### Strapi API integration
Function in server/apiScreenings.js:

async function loadScreeningsByMovieId(movieId) {
  const url = `https://plankton-app-xhkom.ondigitalocean.app/api/screenings?filters[movie]=${movieId}&populate=movie&sort=start_time:asc`;
  const response = await fetch(url);
  const payload = await response.json();
  return payload.data;
}


#### Filtering Logic
Function export default function getUpcomingScreeningsMoviePage(screenings) {}
in server/getUpcomingScreeningsMoviePage.js
filtrates only upcoming screenings and sorts them in ascending order.


This logic is tested in a unit test with mocked data in __tests__/upcomingScreeningsMoviePage.test.js. Test runs with 'npm test'


### Response Format

#### 200 OK 
Example:
{
  "success": true,
  "data": [
    {
      "id": 431,
      "attributes": {
        "start_time": "2026-02-05T12:00:00.000Z",
        "room": "Stora salongen",
        "movie": {
          "data": {
            "id": 8,
            "attributes": {
              "title": "Pulp Fiction"
            }
          }
        }
      }
    }
  ]
}

#### Error response 500 Internal Server Error:
{
  "success": false,
  "error": "Kunde inte ladda visningar"
}


### Frontend API - Client-side Implementation
The screenings are loaded dynamically after the page has been rendered using the browser's fetch() API.

Function in src/scripts/moviePageScreenings.js
export async function loadMovieScreenings() {
  ...
  const response = await fetch(`/api/movies/${movieId}/screenings`);
  ...
}

