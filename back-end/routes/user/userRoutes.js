const express = require("express");
const knex = require("knex");
const dbconfig = require("../../knexfile");
const db = knex(dbconfig.development);
const server = express.Router();

//----------------------------------------------------------------------
/*
    USERS(users)
    id
    email
    public_email
    first_name
    last_name
    image
    desired_title
    area_of_work
    current_location_name
    current_location_lat
    current_location_lon
    interested_location_names
    github
    linkedin
    portfolio
    badge
    badgeURL
    summary
    stripe_customer_id
    stripe_subscription_name
    top_skills
    additional_skills
    familiar_skills

*/
//----------------------------------------------------------------------

// get all users
// does not expect anything, returns [user objects]
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

// get single user
// expects email of existing user in params
// returns user object if user is found
server.get("/:email", (req, res) => {
  const { email } = req.params;

  db("users")
    .where({ email })
    .first()
    .then(user => {
      user
        ? res.status(200).json(user)
        : res
            .status(400)
            .json({ message: "Error finding user, check your email" });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "there is an error fetching user", err: err });
    });
});

// add new user
// expects 'email' in body
// checks if the email is already in the database
// if the email exists, returns existing user, user object
// if the email does not exist, adds new user, first and last name optional, returns [new_user_id]
server.post("/new", (req, res) => {
  const { email } = req.body;

  db("users")
    .where({ email })
    .first()
    .then(existing_user => {
      if (existing_user) {
        res.status(200).json(existing_user);
      } else {
        db("users")
          .insert(req.body, ["email", "first_name", "last_name"])
          .then(new_user_id => {
            res.status(200).json(new_user_id);
          })
          .catch(err => {
            res
              .status(500)
              .json({ message: "error adding new user", err: err });
          });
      }
    })
    .catch(err => {
      db("users");
      res
        .status(500)
        .json({ message: "error checking if user exists", err: err });
    });
});

// expects id of existing user in params
// returns a number 1 if successful
server.put("/:id", (req, res) => {
  const { id } = req.params;

  db("users")
    .where({ id })
    .update(req.body)
    .then(isSuccessful => {
      isSuccessful === 0
        ? res.status(400).json({ message: "Error editing user, check your id" })
        : res.status(200).json(isSuccessful);
    })
    .catch(err => {
      res.status(500).json({ message: "error editing user data", err: err });
    });
});

// expects id of existing user in params
// returns a number 1 if successful
server.delete("/:id", (req, res) => {
  const { id } = req.params;

  db("users")
    .where({ id })
    .delete()
    .then(isSuccessful => {
      isSuccessful === 0
        ? res
            .status(400)
            .json({ message: "Error deleting user, check your id" })
        : res.status(200).json(isSuccessful);
    })
    .catch(err => {
      res.status(500).json({ message: "error deleting user", err: err });
    });
});

//----------------------------------------------------------------------
/*
    USER EXTRAS
      education - id, school, school_dates, field_of_study, *user_id
      experience - id, company_name, job_title, job_dates, job_description, *user_id
      projects - id, project_title, link, project_description, project_img, *user_id
      *user_id not nullable
*/
//----------------------------------------------------------------------

// expects id of existing user in params
// expects user extra, either 'education', 'experience', 'projects' in params
// returns user extras of chosen extra, [user extra objects]
server.get("/:user_id/:user_extra", (req, res) => {
  const { user_id, user_extra } = req.params;

  db(`${user_extra}`)
    .where({ user_id })
    .then(user_extra => {
      user_extra.length === 0
        ? res.status(400).json({
            message: `Error finding user ${req.params.user_extra}, check user id or add a user ${req.params.user_extra}`
          })
        : res.status(200).json(user_extra);
    })
    .catch(err => {
      res.status(500).json({ message: "error fetching data", err: err });
    });
});

// expects user extra, either 'education', 'experience', 'projects' in params
// expects id of existing user in body
// returns id of new user extra
server.post("/:user_extras", (req, res) => {
  const { user_extras } = req.params;

  db(`${user_extras}`)
    .insert(req.body)
    .then(new_user_extra_id => {
      res.status(200).json(new_user_extra_id);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "error adding user_extra data", err: err });
    });
});

// expects user extra, either 'education', 'experience', 'projects' in params
// expects id of the user extra in params
// returns a number 1 if successful
server.put("/:user_extras/:user_extras_id", (req, res) => {
  const { user_extras, user_extras_id } = req.params;
  console.log(user_extras, user_extras_id);
  db(`${user_extras}`)
    .where({ id: user_extras_id })
    .update(req.body)
    .then(isSuccessful => {
      isSuccessful === 0
        ? res
            .status(400)
            .json({ message: "Error editing user extra, check your id" })
        : res.status(200).json(isSuccessful);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "error editing user_extra data", err: err });
    });
});

// expects user extra, either 'education', 'experience', 'projects' in params
// expects id of the user extra in params
// returns a number 1 if successful
server.delete("/:user_extras/:user_extras_id", (req, res) => {
  const { user_extras, user_extras_id } = req.params;

  db(`${user_extras}`)
    .where({ id: user_extras_id })
    .delete()
    .then(isSuccessful => {
      isSuccessful === 0
        ? res
            .status(400)
            .json({ message: "Error deleting user extra, check your id" })
        : res.status(200).json(isSuccessful);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "error deleting user_extra data", err: err });
    });
});

module.exports = server;
