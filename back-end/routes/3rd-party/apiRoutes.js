const express = require("express");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const server = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

server.post(
  "/upload-image",
  fileUpload({
    useTempFiles: true
  }),
  (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).json({ message: "No files were uploaded." });
      return;
    }

    cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
      },
      (err, result) => {
        if (!result || err) {
          res
            .status(500)
            .json({ message: "Error uploading image with cloudinary =>", err });
          return;
        }
        res.send({ url: result.secure_url, id: result.public_id });
      }
    );
  }
);

server.post("/delete-image", (req, res) => {
  cloudinary.uploader.destroy(req.body.id, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Error uploading image with cloudinary", err });
      return;
    }
    if (result.result === "not found") {
      res.status(404).json({ message: "public_id not found" });
      return;
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

server.use(require("body-parser").text());

server.post("/subscribe", async (req, res) => {
  const { token, subType, email } = req.body;
  let plan;

  if (subType === "yearly") {
    plan = process.env.STRIPE_CANDIDATE_YEARLY;
  } else if (subType === "monthly") {
    plan = process.env.STRIPE_CANDIDATE_MONTHLY;
  }

  stripe.customers.create(
    {
      description: `New customer for ${subType} plan`,
      source: token,
      email
    },
    function(err, customer) {
      if (err) {
        res.status(500).json({ message: "Unable to CREATE customer" });
        return;
      }

      stripe.subscriptions.create(
        {
          customer: customer.id,
          items: [{ plan }]
        },
        function(err, subscription) {
          if (err) {
            res.status(500).json({ message: "Unable to SUB customer" });
            return;
          }
          res.send({
            stripe_customer_id: customer.id,
            stripe_subscription_name: subscription.id
          });
        }
      );
    }
  );
});

server.post("/subscribe-existing", (req, res) => {
  const { stripeId, subType } = req.body;

  let plan;

  if (subType === "yearly") {
    plan = process.env.STRIPE_CANDIDATE_YEARLY;
  } else if (subType === "monthly") {
    plan = process.env.STRIPE_CANDIDATE_MONTHLY;
  }

  stripe.subscriptions.create(
    {
      customer: stripeId,
      items: [{ plan }]
    },
    function(err, subscription) {
      if (err) {
        res.status(500).json({ message: "Unable to SUB customer" });
        return;
      }
      res.send({
        stripe_subscription_name: subscription.id
      });
    }
  );
});

server.post("/get-subscription", async (req, res) => {
  const { sub } = req.body;

  stripe.subscriptions.retrieve(sub, function(err, subscription) {
    if (err) {
      res.status(500).json({ message: "Unable to get SUB" });
      return;
    }
    res.send({
      status: subscription.status,
      nickName: subscription.plan.nickname,
      type: subscription.plan.interval,
      created: subscription.created,
      startDate: subscription.current_period_start,
      dueDate: subscription.current_period_end
    });
  });
});

server.post("/cancel-subscription", async (req, res) => {
  const { sub } = req.body;

  stripe.subscriptions.del(sub, function(err, confirmation) {
    if (err) {
      res.status(500).json({ message: "Unable to cancel SUB" });
      return;
    }
    res.send(confirmation);
  });
});

module.exports = server;
