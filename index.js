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
const urlShortner = require("./Tools/urlShortner");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dir = path.resolve(path.join(__dirname, "images"));
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.use("/api/convert", pdfToDocx);
app.use("/api/password", passwordGenerator);
app.use("/api/rss", rss);
app.use("/api/resize", ImageResizer);
app.use("/api/shortenurl", urlShortner);

const randomNumber = faker.datatype.number();
const randomNumberBetween1And100 = Math.floor(randomNumber * 100) + 1;
function generatePhoneNumber() {
  // Generate a random phone number in the format (XXX) XXX-XXXX
  const areaCode = faker.datatype.number(999);
  const prefix = faker.datatype.number(999);
  const suffix = faker.datatype.number(9999);

  return `(${areaCode}) ${prefix}-${suffix}`;
}
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
  order: {
    id: faker.string.uuid(),
    customerId: faker.string.uuid(),
    productId: faker.string.uuid(),
    quantity: randomNumberBetween1And100,
    totalPrice: faker.commerce.price(),
  },
  customer: {
    id: faker.string.uuid(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
    phone: generatePhoneNumber(),
    address: faker.address.streetAddress(),
  },
  employee: {
    id: faker.string.uuid(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
    phone: generatePhoneNumber(),
    jobTitle: faker.name.jobTitle(),
    salary: faker.commerce.price(),
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

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
