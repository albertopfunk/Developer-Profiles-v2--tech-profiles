const express = require("express");
const userModel = require("../../models/user/userModel");

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

// add new user
// checks if the email is already in the database
// if the email exists, returns existing user, user object
// if the email does not exist, adds new user, returns user object
server.post("/new", async (req, res) => {
  let id = 0;
  if (req.body.email) {
    id = req.body.email;
  } else if (req.body.id) {
    id = req.body.id;
  }

  const checkIfUserExists = await userModel.getSingle(id);
  if (checkIfUserExists) {
    res.json(checkIfUserExists);
  } else {
    try {
      const addNewUser = await userModel.insert(req.body);
      res.status(201).json(addNewUser);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error adding the user to the database", err });
    }
  }
});

// get all users
// does not expect anything, returns [user objects]
server.get("/", async (req, res) => {
  try {
    const users = await userModel.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "The users could not be retrieved", err });
  }
});

// get single user
// returns user object if user is found
server.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const getSingleUser = await userModel.getSingle(id);
    getSingleUser
      ? res.json(getSingleUser)
      : res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
  } catch (err) {
    res.status(500).json({ message: "The user could not be retrieved", err });
  }
});

// expects id of existing user in params
// returns a number 1 if successful
server.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const editUser = await userModel.update(id, req.body);
    editUser
      ? res.json(editUser)
      : res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "The user information could not be modified", err });
  }
});

// expects id of existing user in params
// returns a number 1 if successful
server.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removeUser = await userModel.remove(id);
    removeUser
      ? res.json(removeUser)
      : res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
  } catch (err) {
    res.status(500).json({ message: "The user could not be removed", err });
  }
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

// server.get("/:user_id/:user_extra", (req, res) => {
//   const { user_id, user_extra } = req.params;

//   db(`${user_extra}`)
//     .where({ user_id })
//     .then(user_extra => {
//       user_extra.length === 0
//         ? res.status(400).json({
//             message: `Error finding user ${req.params.user_extra}, check user id or add a user ${req.params.user_extra}`
//           })
//         : res.status(200).json(user_extra);
//     })
//     .catch(err => {
//       res.status(500).json({ message: "error fetching data", err: err });
//     });
// });

// expects user extra, either 'education', 'experience', 'projects' in params
// expects id of existing user in body
// returns id of new user extra

// server.post("/:user_extras", (req, res) => {
//   const { user_extras } = req.params;

//   db(`${user_extras}`)
//     .insert(req.body)
//     .then(new_user_extra_id => {
//       res.status(200).json(new_user_extra_id);
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ message: "error adding user_extra data", err: err });
//     });
// });

// expects user extra, either 'education', 'experience', 'projects' in params
// expects id of the user extra in params
// returns a number 1 if successful

// server.put("/:user_extras/:user_extras_id", (req, res) => {
//   const { user_extras, user_extras_id } = req.params;
//   console.log(user_extras, user_extras_id);
//   db(`${user_extras}`)
//     .where({ id: user_extras_id })
//     .update(req.body)
//     .then(isSuccessful => {
//       isSuccessful === 0
//         ? res
//             .status(400)
//             .json({ message: "Error editing user extra, check your id" })
//         : res.status(200).json(isSuccessful);
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ message: "error editing user_extra data", err: err });
//     });
// });

// expects user extra, either 'education', 'experience', 'projects' in params
// expects id of the user extra in params
// returns a number 1 if successful

// server.delete("/:user_extras/:user_extras_id", (req, res) => {
//   const { user_extras, user_extras_id } = req.params;

//   db(`${user_extras}`)
//     .where({ id: user_extras_id })
//     .delete()
//     .then(isSuccessful => {
//       isSuccessful === 0
//         ? res
//             .status(400)
//             .json({ message: "Error deleting user extra, check your id" })
//         : res.status(200).json(isSuccessful);
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ message: "error deleting user_extra data", err: err });
//     });
// });

module.exports = server;
