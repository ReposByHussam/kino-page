import express from 'express';
import fs from 'fs/promises';
// import renderPage from './lib/renderPage.js';

const app = express();


//RENDER LAYOUT
// app.get('/', async (req, res) => {
//   const htmlText = await renderPage('index');
//   res.send(htmlText);
// });

// app.get('/contact', async (req, res) => {
//   const htmlText = await renderPage('contact');
//   res.send(htmlText);
// });

// app.get('/about', async (req, res) => {
//   const htmlText = await renderPage('about');
//   res.send(htmlText);
// });


//PATH TO STATIC FILES


app.use('/src', express.static('./src')); 

app.get('/', async (req, res) => {
  const content = await fs.readFile('./index.html'); // get Buffer in raw bytes
  const html = content.toString();                  // turn to string
  res.send(html);                                   // send response to client
});

app.get('/about-us', async (req, res) => {
  const content = await fs.readFile('./about-us.html'); 
  const html = content.toString();                  
  res.send(html);                                   
});

app.get('/bistro', async (req, res)=>{
    const content = await fs.readFile('./bistro.html');
    const html = content.toString();
    res.send(html);
})

app.get('/contact', async(req, res) =>{
    const html = await fs.readFile('./contact.html', 'utf-8'); // utf-8 as a 2nd arguments lets avoid to write .toString()-method as it does same - converts Buffer to string
    res.send(html);
})

app.get('/eventPage', async (req, res) => {
    const html = await fs.readFile('./eventPage.html', 'utf8'); // utf8 alias for utf-8 (same)
    res.send(html);
})

const port = 3080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);

});