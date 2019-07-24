const express = require("express");


const knex = require("knex");
const dbconfig = require("../../knexfile");
const db = knex(dbconfig.development);


const server = express.Router();

//----------------------------------------------------------------------
/*
USER SKILLS(skills)
id
skill
*/
//----------------------------------------------------------------------



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



// get single skill
server.get("/:id", (req, res) => {
  
  const {id} = req.params;
  
  db("skills").where({id}).first()
    
  
  .then(skills => {
      res.status(200).json(skills);
    })
    
    
    .catch(err => {
      res.status(500).json({ message: "error getting skills", err: err });
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
            .json({ message: "Error deleting skill, check skill id" })
        : res.status(200).json(isSuccessful);
    })
    
    
    .catch(err => {
      res.status(500).json({ message: "error deleting skill data", err: err });
    });
});





module.exports = server;
