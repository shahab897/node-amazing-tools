const express = require("express");
const router = express.Router();
const request = require("request");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3000;

router.post("/", function (req, res) {
  const imageUrl = req.body.imageUrl;
  const width = req.body.width;
  const height = req.body.height;

  if (!imageUrl) {
    res.status(400).send("Missing imageUrl parameter");
    return;
  }

  if (!width && !height) {
    res
      .status(400)
      .send("At least one of width or height parameters is required");
    return;
  }

  const imageFileName = path.basename(imageUrl);
  const imagePath = path.join(__dirname, "../images", imageFileName);

  request(imageUrl)
    .pipe(fs.createWriteStream(imagePath))
    .on("close", () => {
      const pipeline = sharp(imagePath);

      if (width && height) {
        pipeline.resize(width, height);
      } else if (width) {
        pipeline.resize({ width: width });
      } else if (height) {
        pipeline.resize({ height: height });
      }

      const resizedImagePath = path.join(
        __dirname,
        "../images",
        "resized-" + imageFileName
      );

      pipeline.toFile(resizedImagePath, (err, info) => {
        if (err) {
          res.status(500).send(err);
          return;
        }

        const resizedImageUrl = `http://localhost:${PORT}/images/${path.basename(
          resizedImagePath
        )}`;
        res.json({ imageUrl: resizedImageUrl });
      });
    });
});

module.exports = router;
