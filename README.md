# kino-page
Grupparbeta KINO grupp B

## UPPGIFT 2 - SERVER
Efter ’npm install’ går sidan att besöka på  http://localhost:5080 med ’npm start’.

Tillgång till alla filmer finns på startsidan / (rotvägen) som en lista.

Sidan /movies med kort av alla filmer är tillgänglig från startsidan på flera sätt:

från huvudmenyn  ”Filmer idag”  -> ”Alla filmer” (endast desktop: skärmar 900px och större),
från footermenyn  ”Filmer idag”  -> ”Alla filmer” (endast mobil/ platta:  skärmar 599px och mindre),
från knappen ”Alla aktuella filmer” under filmlistan på startsidan (alla skärmstorlekar).
Dessutom finns det tillgång från en enskild filmsida via knappen ”Tillbaka till alla filmer”
Alla filmkort på sidan /movies innehåller filmtitel, filmbild och knappen ”Läs mer” som leder till den enskilda filmens sida /movies/:id (t.ex. /movies/1) som visar filmens titel, intro och bild från API:et enligt uppgift och olika knappar enligt sajtens design och logik.

Det finns 2 integrationstester som körs med ’npm test’:

Enligt uppgiften: verifierar att filmens titel visas korrekt på filmsidan (/__tests__/movie.integration.test.js)
Ytterligare test (/__tests__/movies.test.js) : verifierar att filmtitlar visas korrekt på listningssidan /movies (anpassad från Richards exempel).



# Upcoming Screenings API
## Domain Objects
### Screening
Represents a single movie screening event.

Example:

```{ "startTime": "2025-03-17T12:00:00.000Z", "room": "Stora salongen" }```

### Grouped Screenings
Screenings grouped by day.

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

Example Request (cURL):

```curl -X GET http://localhost:5080/api/upcoming-screenings```

### Response
#### 200 OK
Returns a JSON array of GroupedScreenings.

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

```<div class="upcoming-screenings__day">
  <h3 class="upcoming-screenings__date">måndag 17 mars</h3>
  <p class="upcoming-screenings__screening">12:00 - Stora salongen</p>
  <p class="upcoming-screenings__screening">17:00 - Stora salongen</p>
  <p class="upcoming-screenings__screening">21:00 - Stora salongen</p>
</div>
