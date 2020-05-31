const express = require("express");
const locationsModel = require("../../models/locations/locationsModel");

const server = express.Router();

server.post("/new", async (req, res) => {
  if (!Array.isArray(req.body.locations)) {
    res.status(400).json({
      message: `Expected 'locations' array in body, received '${req.body.locations}'`
    });
    return;
  }

  if (!req.body.user_id) {
    res.status(400).json({
      message: `Expected 'user_id' in body, received '${req.body.user_id}'`
    });
    return;
  }

  try {
    const addNewUserLocation = await locationsModel.insertUserLocation(req.body);
    res.status(201).json(addNewUserLocation);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding the skill to the database" });
  }
});

server.get("/", async (req, res) => {
  try {
    const getAllLocations = await locationsModel.getAll();
    res.json(getAllLocations);
  } catch (err) {
    res.status(500).json({ message: "The skills could not be retrieved", err });
  }
});

module.exports = server;
