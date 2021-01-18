/**
 * All 3rd party APIs are located here
 *
 * Cloudinary
 *
 * Google
 *
 * Stripe
 *
 */

const express = require("express");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const server = express.Router();

// Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});




server.post(
  "/upload-preview-image",
  fileUpload({
    useTempFiles: true,
  }),
  (req, res) => {
    if (
      !req.headers["content-type"] ||
      !req.headers["content-type"].includes("multipart/form-data")
    ) {
      res.status(400).json({
        message: `Expected content-type to be 'multipart/form-data', received '${req.headers["content-type"]}'`,
      });
      return;
    }

    if (!req.files || !req.files.image) {
      res.status(400).json({
        message: `Expected 'image' file, received '${
          !req.files ? req.files : req.files.image
        }'`,
      });
      return;
    }

    if (!req.body.publicId) {
      // profile-0-image-preview

      res.status(400).json({
        message: `Expected 'publicId' in body, received '${req.body.publicId}'`,
      });
      return;
    }

    cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        public_id: publicId,
      },
      (err, result) => {
        if (err) {
          res.status(500).json({ message: "Error uploading image" });
          return;
        }
        res
          .status(200)
          .json({ image: result.secure_url, id: result.public_id });
      }
    );
  }
);

server.post("/upload-main-image", (req, res) => {
  if (!req.body.imageUrl) {
    res.status(400).json({
      message: `Expected 'imageUrl' in body, received '${req.body.imageUrl}'`,
    });
    return;
  }

  if (!req.body.publicId) {
    // profile-0-image-main

    res.status(400).json({
      message: `Expected 'publicId' in body, received '${req.body.publicId}'`,
    });
    return;
  }

  cloudinary.uploader.upload(
    req.body.imageUrl,
    {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      public_id: publicId,
    },
    (err, result) => {
      if (err) {
        res.status(500).json({ message: "Error uploading image" });
        return;
      }
      res.status(200).json({ image: result.secure_url, id: result.public_id });
    }
  );
});




server.post(
  "/upload-image",
  fileUpload({
    useTempFiles: true,
  }),
  (req, res) => {
    if (
      !req.headers["content-type"] ||
      !req.headers["content-type"].includes("multipart/form-data")
    ) {
      res.status(400).json({
        message: `Expected content-type to be 'multipart/form-data', received '${req.headers["content-type"]}'`,
      });
      return;
    }

    if (!req.files || !req.files.image) {
      res.status(400).json({
        message: `Expected 'image' file, received '${
          !req.files ? req.files : req.files.image
        }'`,
      });
      return;
    }

    cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      },
      (err, result) => {
        if (err) {
          res.status(500).json({ message: "Error uploading image" });
          return;
        }
        res
          .status(200)
          .json({ image: result.secure_url, id: result.public_id });
      }
    );
  }
);

server.post("/delete-image", (req, res) => {
  if (!req.body.id) {
    res.status(400).json({
      message: `Expected 'id' in body, received '${req.body.id}'`,
    });
    return;
  }

  cloudinary.uploader.destroy(req.body.id, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error removing image" });
      return;
    }
    if (result.result === "not found") {
      res.status(404).json({ message: "public_id not found" });
      return;
    }
    if (result.result !== "ok") {
      res.status(500).json({ message: "Error removing image" });
      return;
    }
    res.status(200).json(result.result);
  });
});

// Google

server.post("/autocomplete", async (req, res) => {
  const key = process.env.GOOGLE_PLACES_KEY;
  const { value } = req.body;

  if (!value) {
    res.status(400).json({
      message: `Expected 'value' in body, received '${value}'`,
    });
    return;
  }

  const url = `${process.env.GOOGLE_PLACES_AUTOCOMPLETE}/json?input=${value}&types=(cities)&key=${key}`;

  try {
    const response = await axios.post(url);

    if (response.data.status === "ZERO_RESULTS") {
      res.status(404).json({ message: "Zero results found" });
      return;
    }

    if (response.data.status !== "OK") {
      res.status(500).json({ message: "Error getting predictions" });
      return;
    }

    const predictions = response.data.predictions.map((prediction) => {
      return {
        name: prediction.description,
        id: prediction.place_id,
      };
    });

    res.status(200).json(predictions);
  } catch (err) {
    res.status(500).json({ message: "Error getting predictions" });
  }
});

server.post("/gio", async (req, res) => {
  const key = process.env.GOOGLE_PLACES_KEY;
  const { placeId } = req.body;

  if (!placeId) {
    res.status(400).json({
      message: `Expected 'placeId' in body, received '${placeId}'`,
    });
    return;
  }

  const url = `${process.env.GOOGLE_PLACES_GIO}/json?placeid=${placeId}&fields=geometry&key=${key}`;

  try {
    const response = await axios.post(url);

    if (response.data.status !== "OK") {
      res.status(500).json({ message: "Error getting predictions" });
      return;
    }

    res.status(200).json(response.data.result.geometry.location);
  } catch (err) {
    res.status(500).json({ message: "Error getting location gio" });
  }
});

// Stripe

server.use(require("body-parser").text());

server.post("/subscribe", async (req, res) => {
  const { token, subType, email } = req.body;
  let plan;

  if (!token || !subType || !email) {
    res.status(400).json({
      message: `Expected 'token', 'subType', 'email' in body, received '${token}', '${subType}', '${email}' `,
    });
    return;
  }

  if (subType === "yearly") {
    plan = process.env.STRIPE_CANDIDATE_YEARLY;
  } else if (subType === "monthly") {
    plan = process.env.STRIPE_CANDIDATE_MONTHLY;
  } else {
    res.status(400).json({
      message: `Expected 'yearly' or 'monthly' in body, received '${subType}' `,
    });
    return;
  }

  stripe.customers.create(
    {
      description: `New customer for ${subType} plan`,
      payment_method: token,
      email,
      invoice_settings: {
        default_payment_method: token,
      },
    },
    function (err, customer) {
      if (err) {
        res.status(500).json({ message: "Error creating customer" });
        return;
      }

      stripe.subscriptions.create(
        {
          customer: customer.id,
          items: [{ plan }],
        },
        function (err, subscription) {
          if (err) {
            res.status(500).json({ message: "Error subscribing customer" });
            return;
          }
          res.status(200).json({
            stripe_customer_id: customer.id,
            stripe_subscription_name: subscription.id,
          });
        }
      );
    }
  );
});

server.post("/subscribe-existing", (req, res) => {
  const { stripeId, subType } = req.body;
  let plan;

  if (!stripeId || !subType) {
    res.status(400).json({
      message: `Expected 'stripeId', 'subType' in body, received '${stripeId}', '${subType}'`,
    });
    return;
  }

  if (subType === "yearly") {
    plan = process.env.STRIPE_CANDIDATE_YEARLY;
  } else if (subType === "monthly") {
    plan = process.env.STRIPE_CANDIDATE_MONTHLY;
  } else {
    res.status(400).json({
      message: `Expected 'yearly' or 'monthly' in body, received '${subType}' `,
    });
    return;
  }

  stripe.subscriptions.create(
    {
      customer: stripeId,
      items: [{ plan }],
    },
    function (err, subscription) {
      if (err) {
        res.status(500).json({ message: "Error re-subscribing customer" });
        return;
      }
      res.status(200).json({
        stripe_subscription_name: subscription.id,
      });
    }
  );
});

server.post("/get-subscription", async (req, res) => {
  const { sub } = req.body;

  if (!sub) {
    res.status(400).json({
      message: `Expected 'sub' in body, received '${sub}'`,
    });
    return;
  }

  stripe.subscriptions.retrieve(sub, function (err, subscription) {
    if (err) {
      res.status(500).json({ message: "Error getting subscription" });
      return;
    }

    for (let data in subscription) {
      if (
        data === "created" ||
        data === "current_period_start" ||
        data === "current_period_end"
      ) {
        let date = subscription[data] * 1000;
        let normDate = new Date(date);
        normDate = normDate.toString();
        let normDateArr = normDate.split(" ");
        subscription[
          data
        ] = `${normDateArr[1]} ${normDateArr[2]}, ${normDateArr[3]}`;
      }
    }

    res.status(200).json({
      status: subscription.status,
      nickName: subscription.plan.nickname,
      type: subscription.plan.interval,
      created: subscription.created,
      startDate: subscription.current_period_start,
      dueDate: subscription.current_period_end,
    });
  });
});

server.post("/cancel-subscription", async (req, res) => {
  const { sub } = req.body;

  if (!sub) {
    res.status(400).json({
      message: `Expected 'sub' in body, received '${sub}'`,
    });
    return;
  }

  stripe.subscriptions.del(sub, function (err, confirmation) {
    if (err) {
      res.status(500).json({ message: "Error removing subscription" });
      return;
    }
    res.status(200).json(confirmation);
  });
});

module.exports = server;
