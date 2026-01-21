import express from "express";
//import { engine } from "express-handlebars"; //engine-module that integrates Handlebars to Express for HTML-templates when content is rendered dynamically (e.g. via API)
import renderPage from './renderPage.js';
import api from "./movies-backendAPI.js";

export default function initApp(moviesAPI) {
    const app = express();

    //1) ROUTE TO STATIC FILES
    //route to static files .use('/folderName', express.static('./folderName')) should go before dynamic routes app.get(), otherwise it'll not be read
    //'/src' - absolute route from the project root
    //'./src' - relative route from the folderName
    app.use('/src', express.static('./src'));

    //2) DYNAMIC ROUTES: SSR - render layout and get it 
    // SSR - start page
    app.get('/', async (req, res) => {
        try {
            const movies = await moviesAPI.loadMovies();
            const htmlText = await renderPage('index', { movies }); //{movies} - object with data from API-JSON
            res.send(htmlText);
        } catch (error) {
            console.error("Error loading movies:", error);
            const htmlText = await renderPage('index', { movies: [] }); //if { movies } empty
            res.send(htmlText);
        }
    });

    // SSR all other pages
    app.get('/about-us', async (req, res) => {
        const htmlText = await renderPage('about-us');
        res.send(htmlText);
    });

    app.get('/bistro', async (req, res) => {
        const htmlText = await renderPage('bistro');
        res.send(htmlText);
    });

    app.get('/contact', async (req, res) => {
        const htmlText = await renderPage('contact');
        res.send(htmlText);
    });

    app.get('/eventPage', async (req, res) => {
        const htmlText = await renderPage('eventPage');
        res.send(htmlText);
    });

    // All movies (cards)
    app.get("/movies", async (req, res) => {
        try {
            const movies = await moviesAPI.loadMovies();
            const htmlText = await renderPage("movies", { movies });
            res.send(htmlText);
            //for the list (not cards), but with content/movies-list.hbs instead of content/movies.hbs
            //const htmlText = await renderPage("movies-list", { movies });
        } catch (error) {
            console.error("Error loading movies:", error);
            res.status(500).send("Kunde inte ladda filmerna");  //status 500 = server error
        }
    });

    //One movie page by Id
    app.get("/movies/:movieId", async (req, res) => {
        try {
            const movie = await moviesAPI.loadMovie(req.params.movieId);
            const htmlText = await renderPage("movie", { movie });
            res.send(htmlText);
        } catch (error) {
            console.error(`Error loading movie ${req.params.movieId}:`, error);
            res.status(404).send("Film hittades inte");
        }
    });

    //FALLBACK for STATUS 404 msg
    app.use((req, res) => {
        res.status(404).send('Page is not found');
    });

    return app;
}