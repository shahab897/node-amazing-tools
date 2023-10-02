const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const { faker } = require("@faker-js/faker");
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

const dataTypes = {
  user: {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  },
  company: faker.company.name(),
  address: faker.address.streetAddress(),
  product: {
    id: faker.datatype.uuid(), // Unique identifier for the product
    name: faker.commerce.productName(), // Name of the product
    description: faker.commerce.productDescription(), // Description of the product
    price: faker.commerce.price(), // Price of the product
    quantity: faker.datatype.number(100), // Quantity of the product available
    images: [faker.image.imageUrl(), faker.image.imageUrl()], // Array of image URLs for the product
  },
};

//random data generator API
app.get("/random-data/:dataType", (req, res) => {
  // Get the data type from the request URL
  const dataType = req.params.dataType;

  // Generate random data for the specified data type
  const data = dataTypes[dataType];

  // If the data type is not supported, return an error message
  if (!data) {
    return res.status(400).send("Invalid data type");
  }

  data = {};
  // Send the data back to the client in JSON format
  res.json(data);
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
