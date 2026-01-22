const express = require("express");
const path = require("path");

const app = express();
const PORT = 5080;

app.use(express.static(__dirname));
app.use("/src", express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Kino kör på http://localhost:${PORT}`);
});