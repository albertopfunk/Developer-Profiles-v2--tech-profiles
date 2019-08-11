const express = require("express");
const server = express.Router();

server.post("/autocomplete", async (req, res) => {
  const key = process.env.GOOGLE_PLACES_KEY;
  const { locationInput } = req.body;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${locationInput}&types=(cities)&key=${key}`;

  try {
    const response = await axios.post(url);
    res.send(response.data);
  } catch (err) {
    res.send({ err });
  }
});

server.post("/gio", async (req, res) => {
  const key = process.env.GOOGLE_PLACES_KEY;
  const { placeId } = req.body;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=geometry&key=${key}`;

  try {
    const response = await axios.post(url);
    res.send(response.data);
  } catch (err) {
    res.send({ err });
  }
});

module.exports = server;
