const express = require("express");
const knex = require("knex");
const dbconfig = require("../knexfile");
const db = knex(dbconfig[process.env.DB]);
const server = express.Router();

//----------------------------------------------------------------------
//      USERS
//----------------------------------------------------------------------

// all users
server.get("/", (req, res) => {
  db("users")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "there is an error fetching users", err: err });
    });
});

// single user
server.get("/:email", (req, res) => {
  const { email } = req.params;

  db("users")
    .where({ email })
    .first()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "there is an error fetching user", err: err });
    });
});

// new user, checks if user exists before adding
server.post("/new", (req, res) => {
  const { email } = req.body;

  db("users")
    .where({ email })
    .first()
    .then(existing_user => {
      res.status(200).json(existing_user);
    })
    .catch(err => {
      db("users")
        .insert(req.body, ["email", "first_name", "last_name"])
        .then(new_user => {
          res.status(200).json(new_user);
        })
        .catch(err => {
          res.status(500).json({ message: "error posting new user", err: err });
        });
    });
});

// edit user
server.put("/:id", (req, res) => {
  const { id } = req.params;

  db("users")
    .where({ id })
    .update(req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "error editing user data", err: err });
    });
});

// delete user
server.delete("/:id", (req, res) => {
  const { id } = req.params;

  db("users")
    .where({ id })
    .delete()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "error deleting user", err: err });
    });
});

//----------------------------------------------------------------------
//      USER EXTRAS
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


//----------------------------------------------------------------------
//      USER SKILLS
//----------------------------------------------------------------------

       






module.exports = server;
