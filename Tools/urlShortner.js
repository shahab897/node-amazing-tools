const express = require("express");
const router = express.Router();
const request = require("request");

function generateShortUrl() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let shortUrl = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    shortUrl += chars[randomIndex];
  }

  return shortUrl;
}

app.post("/api/shortenurl", function (req, res) {
  const longUrl = req.body.longUrl;
  // use this code to get baseurl when in production
  // const baseUrl = req.protocol + '://' + req.hostname + req.baseUrl;

  if (!longUrl) {
    res.status(400).send("Missing longUrl parameter");
    return;
  }

  let shortUrl;
  do {
    shortUrl = generateShortUrl();
  } while (db[shortUrl]);

  db[shortUrl] = longUrl;
  fs.writeFileSync(dbFilePath, JSON.stringify(db));

  res.json({ shortUrl: `http://localhost:${PORT}/${shortUrl}` });
});

module.exports = router;
