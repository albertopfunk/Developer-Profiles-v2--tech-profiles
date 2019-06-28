const express = require("express");
const knex = require("knex");
const dbconfig = require("../knexfile");
const db = knex(dbconfig[process.env.DB]);
const server = express.Router();

//----------------------------------------------------------------------
//      EXTRAS
//----------------------------------------------------------------------

server.get("/:user_id/:user_extras", (req, res) => {
  const { user_id, user_extras } = req.params;

  db(`${user_extras}`)
    .where({ user_id })
    .then(user_extras => {
      res.status(200).json(user_extras);
    })
    .catch(err => {
      res.status(500).json({ message: "error fetching data", err: err });
    });
});

server.post("/:user_extras", (req, res) => {
  const { user_extras } = req.params;

  // user_id in req.body
  db(`${user_extras}`)
    .insert(req.body)
    .then(user_extra => {
      res.status(200).json(user_extra);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "error adding user_extra data", err: err });
    });
});

server.put("/:user_extras/:user_extras_id", (req, res) => {
  const { user_extras, user_extras_id } = req.params;

  db(`${user_extras}`)
    .where({ user_extras_id })
    .update(req.body)
    .then(user_extra => {
      res.status(200).json(user_extra);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "error editing user_extra data", err: err });
    });
});

server.delete("/:user_extras/:user_extras_id", (req, res) => {
  const { user_extras, user_extras_id } = req.params;

  db(`${user_extras}`)
    .where({ user_extras_id })
    .delete()
    .then(user_extra => {
      res.status(200).json(user_extra);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "error deleting user_extra data", err: err });
    });
});
