const express = require("express");
const router = express.Router();
const request = require("request");
const fs = require("fs");

const db = JSON.parse(fs.readFileSync(dbFilePath, "utf-8"));

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

router.post("/", function (req, res) {
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

app.get("/:shortUrl", function (req, res) {
  const longUrl = db[req.params.shortUrl];

  if (!longUrl) {
    res.status(404).send("Short URL not found");
    return;
  }

  res.redirect(longUrl);
});

module.exports = router;
