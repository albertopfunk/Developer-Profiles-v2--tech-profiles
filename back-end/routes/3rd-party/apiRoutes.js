const express = require("express");
const axios = require("axios");

const server = express.Router();

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

module.exports = server;
