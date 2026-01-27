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
