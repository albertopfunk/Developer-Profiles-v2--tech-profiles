const express = require("express");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

const server = express.Router();

server.use(
  fileUpload({
    useTempFiles: true
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

server.post("/upload-image", (req, res) => {
  cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    { folder: process.env.CLOUDINARY_PROFILE_DASH },
    (err, result) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Error uploading image with cloudinary", err });
      }
      res.send({ url: result.secure_url, id: result.public_id });
    }
  );
});

server.post("/delete-image", (req, res) => {
  cloudinary.uploader.destroy(req.body.id, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Error uploading image with cloudinary", err });
    }
    if (result.result === "not found") {
      res.status(404).json({ message: "public_id not found" });
    }
    res.send(result.result);
  });
});

server.post("/autocomplete", async (req, res) => {
  const key = process.env.GOOGLE_PLACES_KEY;
  const { locationInput } = req.body;
  const url = `${process.env.GOOGLE_PLACES_AUTOCOMPLETE}/json?input=${locationInput}&types=(cities)&key=${key}`;

  try {
    const response = await axios.post(url);
    res.send(response.data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error with places/autocomplete API", err });
  }
});

server.post("/gio", async (req, res) => {
  const key = process.env.GOOGLE_PLACES_KEY;
  const { placeId } = req.body;
  const url = `${process.env.GOOGLE_PLACES_GIO}/json?placeid=${placeId}&fields=geometry&key=${key}`;

  try {
    const response = await axios.post(url);
    res.send(response.data.result.geometry.location);
  } catch (err) {
    res.status(500).json({ message: "Error with places/details API", err });
  }
});


// billing

module.exports = server;
