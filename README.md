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


## PART 2 – Popular Movies (Top 5)

This part implements the functionality for displaying the most popular movies on the start page, based on user ratings.

The list is loaded client-side using the browser’s fetch() API after the page has rendered and is not server-side rendered.

### Requirements
- Maximum five movies are returned
- Only ratings from the last 30 days are included
- Movies without any ratings from the last 30 days are excluded
- All calculation logic is implemented on the server
- The logic is verified using unit tests with mocked data

### Server API Endpoint
Get popular movies

**Method:** GET  
**Endpoint:** `/api/popular-movies`

### Response – 200 OK
Returns an array of popular movies sorted by average rating (highest first).

**Example response:**
```json
[
  {
    "id": 8,
    "title": "Pulp Fiction",
    "averageRating": 4.6
  },
  {
    "id": 3,
    "title": "The Matrix",
    "averageRating": 4.2
  }
]

If no movies match the criteria, an empty array is returned.

Server-side logic

The calculation logic is implemented on the server in server/popularMovies.js as a pure function.

The server:
- Loads movies and reviews from the CMS
- Filters ratings to the last 30 days
- Calculates average rating per movie
- Returns a maximum of five movies

Testing

The logic is tested using unit tests with mocked data.

Tests are run with:
npm test


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

  
# PART 4 - Movie Reviews (list + pagination)

## Server API Endpoint
### Reviews for a movie
GET /api/movies/:movieId/reviews  
Returns reviews for a single movie with server-side pagination.

### Request
Method: GET

Endpoint: /api/movies/:movieId/reviews

Query parameters:
- page (default: 1)
- pageSize (max: 5)

Example Request:
```curl -X GET "http://localhost:5080/api/movies/1/reviews?page=1&pageSize=5"```

## Response
### 200 OK
Returns a JSON object with `reviews` and `pagination`.

Example Response:
```json
{
  "reviews": [
    {
      "id": 123,
      "name": "Iman",
      "rating": 5,
      "comment": "Great movie!",
      "createdAt": "2026-02-02T19:10:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 5,
    "pageCount": 2,
    "total": 7
  }
}
```
# PART 4.1 - Review section with no page reload
This part allows for the ability so submit a movie review from the movie detail page (/movies:id) without reloading the page, using the browsers fetch() API. 

#### What the user can do
On a movie detail page, the user can submit:
- Name (Author)
- Rating (integer 0-5)
- Comment (optional)

The form is submitted asynchronously and shows a status message in the UI. 

## Server API endpoin
#### Create Review
Method: POST

#### Endpoint: /api/movies/:movieId/reviews
This endpoint validates the review data on the server and then forwards it to the CMS. 

#### Validation rules
- movieId MUST be a valid number (>0)
- author IS required and trimmed using trim()
- rating MUST be an integer between 0 - 5
- comment is optional and trimmed

#### Responses
201 created (Success)
```
{
  "created": {
    "id": 123,
    "author": "Hadji",
    "rating": 5,
    "comment": "Great movie!"
  }
}
```
#### 400 bad request (validation error)

```
{ "error": "Betyget måste vara ett heltal mellan 0 och 5." }
```

#### 502 Bad GateWay (CMS error / newtork error)

```
{ "error": "Kunde inte spara recensionen, försök igen senare." }
```

#### Server implementation
Route handler in server/app.js
```
app.post("/api/movies/:movieId/reviews", async (req, res) => {...}
   
```
 
  ## CMS integration
  The server forwards review creation to the CMS

  This implementation can be seen in movies-backendAPI.js:
  async function createReview({ movieId, author, rating, comment }) {
  ...
  // POST to Strapi /reviews using Strapi format: { data: {...} }
}

The request body uses strapi's required format, which is:
```
{
  "data": {
    "movie": 1,
    "author": "Hadji",
    "rating": 5,
    "comment": "Great movie!"
  }
}
```

## Frontend, Client side fetch
The review form is seen on the movie page which is in the content/movie.hbs and submitted without reload. 

#### Example: 

```
<form id="review-form" data-movie-id="{{movie.id}}">
  <input name="author" />
  <input name="rating" type="number" min="0" max="5" step="1" />
  <textarea name="comment"></textarea>
  <p id="review-message" aria-live="polite"></p>
  <button type="submit">Skicka recension</button>
</form>
```

#### JavaScript Implementation
In reviewForm.js, i have created a function that: 
- Prevent default form submit
- Reads form values with FormData
- Sens POST request via fetch:

  ```
  await fetch(`/api/movies/${movieId}/reviews`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ author, rating, comment }),});



- Displays status message in #review-message
- Resets the form on sucess by using form.reset()

## How to Verify (Proof of and no reload)
1. Start server: npm start
2. Open a movie page
3. Submit a review
4. Confirm:
   - The page does not reload
   - #review-message updates, for example: "skickar" and "tack!..."
5. DevTools
   - You should see a request POST: /api/movies/:id/reviews
   - Stauts 201 on sucess, 400 on validation errors.
¨

## PART 6 – movie rating from CMS or IMDB

### GET /api/movies/:id/rating

### Description
Gets rating for a specific movie.

The rating is calculated using the following logic:
- If a movie has **five or more reviews** in CMS, the average rating is calculated from those reviews.
- If a movie has **fewer than five reviews** in CMS, the rating is fetched from **IMDB** via **OMDB API**.

All logic is performed on the **server**.  
The frontend only receives finished data from this endpoint.

---

### URL example

GET /api/movies/2/rating

#### External data sources used for this endpoint:

CMS (Strapi)
- /api/reviews?filters[movie]=:id //To filter the amount of reviews for a specific movie
- /api/movies/:id //To get the imdbId which is needed for OMDB-API

OMDB-API
- `http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
- Gets IMDB-grade if the amount of CMS-reviews is fewer than five

### Example response from CMS-source
{
  "movieId": "2",
  "rating": 2.9,
  "source": "cms",
  "reviewCount": 15
}

Example response from IMDB
{
  "movieId": "13",
  "rating": 7.4,
  "source": "imdb",
  "reviewCount": 1
}

### Description of information provided:
1. movieId, type = String, the specific movie-ID
2. rating, type = Number, the average rating for the specific movie
3. source, type = String, “cms” or “imdb”
4. reviewCount, type = Number, the amount of reviews in CMS

### Error handling
If the rating for a movie cannot be fetched from the source, the following response is returned:

{
  "error": "Kunde inte hämta aktuella betyg"
}

HTTP status code: 502

### Environmental variables
To enable IMDB-fallback, the following environmental variable is required:

OMDB_API_KEY=<your_api_key>


This variable is loaded via process.env and is not stored in the source code or the git repository. An example file .env.example is available in the repo. Please ask Leo or Nabeel for API key if you do not have one. 

Frontend Implementation

The rating is fetched asynchronously after the page load (DOMContentLoaded).

The script looks for a DOM element with id="movie-rating" and data-movie-id="...".

It updates the UI to show the rating and source (e.g., "7.8 (imdb)").
---






