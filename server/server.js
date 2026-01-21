/*import express from 'express';

import { engine } from "express-handlebars";
import api from "./movies-backendAPI.js";

const app = express();

//ROUTE TO STATIC FILES
//route to static files .use('/folderName', express.static('./folderName')) should go before dynamic routes app.get(), otherwise it'll not be read
//'/src' - absolute route from the project root
//'./src' - relative route from the folderName
app.use('/src', express.static('./src'));

//SSR - render layout and get it 
//SSR - home page
app.get('/', async (req, res) => {
    const htmlText = await renderPage('index');
    res.send(htmlText);
});

//SSR - all other pages and status 404 instead of routing each page separately
// app.get('/:page', async (req, res) => {
//     const { page } = req.params;

//     try {
//         const htmlText = await renderPage(page);
//         res.send(htmlText);
//     } catch (err) {
//         res.status(404).send('This page is not found');
//     }
// });

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

//FALLBACK for STATUS 404 msg
app.use((req, res) => {
  res.status(404).send('Page is not found');
});

const port = 5080;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
*/

import initApp from "./app.js";
import api from './movies-backendAPI.js';

const app = initApp(api);

app.listen(5080);