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
    const addNewUserLocation = await locationsModel.insertUserLocation(
      req.body
    );
    res.status(201).json(addNewUserLocation);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding the location to the database" });
  }
});

server.post("/delete-user-locations", async (req, res) => {
  if (!req.body.user_id) {
    res.status(400).json({
      message: `Expected 'user_id' in body, received '${req.body.user_id}'`
    });
    return;
  }

  try {
    const removeUserLocations = await locationsModel.removeUserLocations(
      req.body.user_id
    );
    res.status(200).json(removeUserLocations);
  } catch (err) {
    res.status(500).json({ message: "Error removing user-locations" });
  }
});

server.post("/delete-user-location", async (req, res) => {
  if (!req.body.location_id) {
    res.status(400).json({
      message: `Expected 'location_id' in body, received '${req.body.location_id}'`
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
    const removeUserLocation = await locationsModel.removeUserLocation(
      req.body.user_id,
      req.body.location_id
    );
    res.status(200).json(removeUserLocation);
  } catch (err) {
    res.status(500).json({ message: "Error removing user-location" });
  }
});

module.exports = server;
