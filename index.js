const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 3000;
const app = express();
const pdfToDocx = require("./Tools/pdfToDocx");
const passwordGenerator = require("./Tools/passwordGenerator");
const rss = require("./Tools/rss");
const ImageResizer = require("./Tools/imageResizer");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbFilePath = "./urls.json";
const dir = path.resolve(path.join(__dirname, "images"));
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
if (!fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, "{}");
}

const db = JSON.parse(fs.readFileSync(dbFilePath, "utf-8"));

app.use("/api/convert", pdfToDocx);
app.use("/api/password", passwordGenerator);
app.use("/api/rss", rss);
app.use("/api/resize", ImageResizer);

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

app.get("/:shortUrl", function (req, res) {
  const longUrl = db[req.params.shortUrl];

  if (!longUrl) {
    res.status(404).send("Short URL not found");
    return;
  }

  res.redirect(longUrl);
});

//random data generator API
app.get("/random-data/:dataType", (req, res) => {
  // Get the data type from the request URL
  const dataType = req.params.dataType;

  //add check here If the data type is not supported, return an error message

  data = {};
  // Send the data back to the client in JSON format
  res.json(data);
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
