const express = require("express");
const knex = require("knex");
const dbconfig = require("../knexfile");
const db = knex(dbconfig.development);
const server = express.Router();

//----------------------------------------------------------------------
/*
    USER SKILLS(skills)
    id
    skill
*/
//----------------------------------------------------------------------

// get all skills
// does not expect anything, returns [skill objects]
server.get("/", (req, res) => {
  db("skills")
    .then(skills => {
      res.status(200).json(skills);
    })
    .catch(err => {
      res.status(500).json({ message: "error getting skills", err: err });
    });
});

// adds new skill
// expects 'skill' in body
// returns [new skill id]
server.post("/new", (req, res) => {
  db("skills")
    .insert(req.body)
    .then(skill => {
      res.status(200).json(skill);
    })
    .catch(err => {
      res.status(500).json({ message: "error adding new skill", err: err });
    });
});

// expects id of existing skill in params
// returns a number 1 if successful
server.put("/:skill_id", (req, res) => {
  const { skill_id } = req.params;

  db("skills")
    .where({ id: skill_id })
    .update(req.body)
    .then(isSuccessful => {
      isSuccessful === 0
        ? res
            .status(400)
            .json({ message: "Error editing skill, check skill id" })
        : res.status(200).json(isSuccessful);
    })
    .catch(err => {
      res.status(500).json({ message: "error editing skill data", err: err });
    });
});

// expects id of existing skill in params
// returns a number 1 if successful
server.delete("/:skill_id", (req, res) => {
  const { skill_id } = req.params;

  db("skills")
    .where({ id: skill_id })
    .delete()
    .then(isSuccessful => {
      isSuccessful === 0
        ? res
            .status(400)
            .json({ message: "Error editing skill, check skill id" })
        : res.status(200).json(isSuccessful);
    })
    .catch(err => {
      res.status(500).json({ message: "error editing skill data", err: err });
    });
});

//----------------------------------------------------------------------
/*
USER SKILLS FOR REVIEW(skills_for_review)
id
skill_for_review
user_id (not nullable)
*/
//----------------------------------------------------------------------

// get all skills for review
// does not expect anything, returns [skill for review objects]
server.get("/review", (req, res) => {
  db("skills_for_review")
    .then(skills_for_review => {
      res.status(200).json(skills_for_review);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "error getting skills for review", err: err });
    });
});

// adds new skill for review
// expects 'skill_for_review' in body
// expects 'user_id' in body
// returns [new skill for review id]
server.post("/review/new", (req, res) => {
  console.log(req.body);
  db("skills_for_review")
    .insert(req.body)
    .then(skill_for_review => {
      res.status(200).json(skill_for_review);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "error adding new skill for review", err: err });
    });
});

// expects id of existing skill for review in params
// returns a number 1 if successful
server.put("/review/:skill_for_review_id", (req, res) => {
  const { skill_for_review_id } = req.params;

  db("skills_for_review")
    .where({ id: skill_for_review_id })
    .update(req.body)
    .then(isSuccessful => {
      isSuccessful === 0
        ? res.status(400).json({
            message: "Error editing skill for review, check skill for review id"
          })
        : res.status(200).json(isSuccessful);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "error editing skill for review data", err: err });
    });
});

// expects id of existing skill for review in params
// returns a number 1 if successful
server.delete("/review/:skill_for_review_id", (req, res) => {
  const { skill_for_review_id } = req.params;

  db("skills_for_review")
    .where({ id: skill_for_review_id })
    .delete()
    .then(isSuccessful => {
      isSuccessful === 0
        ? res.status(400).json({
            message: "Error editing skill for review, check skill for review id"
          })
        : res.status(200).json(isSuccessful);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "error editing skill for review data", err: err });
    });
});

module.exports = server;
