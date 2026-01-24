import { describe, expect, test } from '@jest/globals'; //JEST testing utilities received by 'npm install jest'
import request from 'supertest';  //SUPERTEST - HTTP testing library for simulating requests to Express app received by 'npm i supertest'
import initApp from './app.js';

//mocking JSON-data structure from API from the side server (e.g. plankton-app-xhkom.ondigitalocean.app/api/movies)
const mockApi = {
  loadMovie: async (id) => {
    return {
      "data": {
        "id": id,
        "attributes": {
          "title": "The Godfather",
          "imdbId": "tt0068646",
          "intro": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.\n\n",
          "image": {
            "url": "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_.jpg"
          },
          "createdAt": "2026-01-15T13:27:00.409Z",
          "updatedAt": "2026-01-15T13:30:26.154Z",
          "publishedAt": "2026-01-15T13:27:05.498Z"
        }
      },
    };
  },
  loadMovies: async () => {
    return {
      "data": [
        {
          "id": 12,
          "attributes": {
            "title": "The Godfather",
            "imdbId": "tt0068646",
            "intro": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.\n\n",
            "image": {
              "url": "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_.jpg"
            },
            "createdAt": "2026-01-15T13:27:00.409Z",
            "updatedAt": "2026-01-15T13:30:26.154Z",
            "publishedAt": "2026-01-15T13:27:05.498Z"
          }
        },
        {
          "id": 2,
          "attributes": {
            "title": "Encanto",
            "imdbId": "tt2953050",
            "intro": "A Colombian teenage girl has to face the frustration of being **the only member of her family** without magical powers.\n\n",
            "image": {
              "url": "https://m.media-amazon.com/images/M/MV5BOTY1YmU1ZTItMzNjZC00ZGU0LTk0MTEtZDgzN2QwOWVlNjZhXkEyXkFqcGc@._V1_.jpg"
            },
            "createdAt": "2023-01-23T06:46:24.765Z",
            "updatedAt": "2025-01-15T10:41:46.386Z",
            "publishedAt": "2023-01-23T06:46:29.324Z"
          }
        },
      ],
      "meta": {
        "pagination": {
          "page": 1,
          "pageSize": 25,
          "pageCount": 1,
          "total": 11
        }
      }
    }
  },
};

//INTEGRATION TEST (varifies if movie data from API side server are rendered on my site page)
//describe()- creates group of related tests
//test() - defines a single test case wit description (1st argument) and function (2nd argument)
describe('Movie list page', () => {
  test('lists movies from API', async () => {
    const app = initApp(mockApi);

//request(app) - SUPERTEST creates a test HTTP-client for HTTP-request that interacts with Express 'app'
    const response = await request(app)
      .get('/') // GET request to the start page
      .expect('Content-Type', /html/) //varify whether response is HTML
      .expect(200); //HTTP status 200 (OK)

//Assertions: check if rendered HTML contains expected movie titles
//expect() - test result checking
//response.text - HTML sring of the rendered page 
//.toContain('') - if contains this string (film title) on the rendered page
    expect(response.text).toContain('Encanto');
    expect(response.text).toContain('The Godfather');
  });
});