const express = require("express");
const userExtrasModel = require("../../models/user-extras/userExtrasModel");

const server = express.Router();



//----------------------------------------------------------------------
/*
    USER EXTRAS
      education - id, school, school_dates, field_of_study, *user_id
      experience - id, company_name, job_title, job_dates, job_description, *user_id
      projects - id, project_title, link, project_description, project_img, *user_id
      *user_id not nullable
*/
//----------------------------------------------------------------------


// expects user extra, either 'education', 'experience', 'projects' in params
// expects id of existing user in body
// returns id of new user extra
server.post("/new/:user_extra", async (req, res) => {
  const { user_extra } = req.params;

  try {
    const addNewUserExtra = await userExtrasModel.insert(user_extra, req.body);
    res.status(201).json(addNewUserExtra);
  } catch (err) {
    res
      .status(500)
      .json({
        message: `Error adding the user's '${user_extra}' to the database`,
        err
      });
  }
});


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
// expects id of the user extra in params
// returns a number 1 if successful

// server.put("/:user_extras/:user_extras_id", (req, res) => {

//   const { user_extras, user_extras_id } = req.params;

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
