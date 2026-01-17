import express from 'express';
import renderPage from './renderPage.js';

const app = express();

//ROUTE TO STATIC FILES
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

//FIRST SERVER SET-UP
// app.get('/', async (req, res) => {
//   const content = await fs.readFile('./index.html'); // get Buffer in raw bytes
//   const html = content.toString();                  // turn to string
//   res.send(html);                                   // send response to client
// });

// app.get('/about-us', async (req, res) => {
//   const content = await fs.readFile('./about-us.html'); 
//   const html = content.toString();                  
//   res.send(html);                                   
// });

// app.get('/bistro', async (req, res)=>{
//     const content = await fs.readFile('./bistro.html');
//     const html = content.toString();
//     res.send(html);
// })

// app.get('/contact', async(req, res) =>{
//     const html = await fs.readFile('./contact.html', 'utf-8'); // utf-8 as a 2nd arguments lets avoid to write .toString()-method as it does same - converts Buffer to string
//     res.send(html);
// })

// app.get('/eventPage', async (req, res) => {
//     const html = await fs.readFile('./eventPage.html', 'utf8'); // utf8 alias for utf-8 (same)
//     res.send(html);
// })

const port = 5080;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});