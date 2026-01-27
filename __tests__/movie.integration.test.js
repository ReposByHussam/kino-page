import { describe, expect, test } from '@jest/globals'; //JEST testing utilities received by 'npm install jest'
import request from 'supertest';  //SUPERTEST - HTTP testing library for simulating requests to Express app received by 'npm i supertest'
import initApp from '../server/app.js';

//mocking JSON-data structure from API from the side server (e.g. plankton-app-xhkom.ondigitalocean.app/api/movies)
const rawMockApi = {
    loadMovie: async (id) => {
        return {
            "data": {
                "id": 6,
                "attributes": {
                    "title": "Forrest Gump",
                    "imdbId": "tt0109830",
                    "intro": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
                    "image": {
                        "url": "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_.jpg"
                    },
                    "createdAt": "2023-03-12T17:06:09.208Z",
                    "updatedAt": "2026-01-15T12:46:01.032Z",
                    "publishedAt": "2023-03-12T17:06:16.643Z"
                }
            }
        };
    },
};

//copy of function flattenMovieObject from movies-backendAPI.js to transform API response structure (moves attributes from nested object to root level)
const createMockBackendAPI = () => {
    const flattenMovieObject = (movie) => ({
        id: movie.id,
        ...movie.attributes
    });

    return {
        loadMovie: async (id) => {
            const response = await rawMockApi.loadMovie(id);
            return flattenMovieObject(response.data);
        },
    };
};

//INTEGRATION TEST (varifies if movie data from API side server are rendered on my site page)
//describe()- creates group of related tests
//test() - defines a single test case wit description (1st argument) and function (2nd argument)
describe('Movie title on same movie page', () => {
    test('movies title from API', async () => {
        const mockApi = createMockBackendAPI();
        const app = initApp(mockApi);

        //request(app) - SUPERTEST creates a test HTTP-client for HTTP-request that interacts with Express 'app'
        const response = await request(app)
            .get('/movies/:movieId') // GET request to the start page
            .expect('Content-Type', /html/) //varify whether response is HTML
            .expect(200); //HTTP status 200 (OK)

        //Assertions: check if rendered HTML contains expected movie titles
        //expect() - test result checking
        //response.text - HTML sring of the rendered page 
        //.toContain('') - if contains this string (film title) on the rendered page
        expect(response.text).toContain('Forrest Gump');
    });
});