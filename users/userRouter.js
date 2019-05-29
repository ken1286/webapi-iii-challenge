const express = require('express');
const db = require('./userDb.js');
const router = express.Router();

router.post('/', (req, res) => {
  const newUser = req.body;
  if(!newUser.name) {
    res.status(400).json({ error: 'Please provide a name for the user.'});
  }

  db.insert(newUser)
    .then( user => {
      res.status(200).json({ user });
    })
    .catch( err => {
      res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {

  db.get()
    .then( users => {
      res.status(200).json({ users });
    })
    .catch( err => {
      res.status(500).json({ error: "The users information could not be retrieved." })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  const { id } = req.params;

  db.getById(id)
    .then( user => {
        res.status(200).json({ user });
      })
    .catch( err => {
      res.status(500).json({ error: "The user information could not be retrieved." });
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;

  db.getUserPosts(id)
    .then( posts => {
      res.status(200).json({ posts });
    })
    .catch(err => {
      res.status(500).json({ error: 'The user posts could not be retrieved'});
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then( user => {
      res.status(204).json({ user })
    })
    .catch( err => {
       res.status(500).json({ message: 'error' });
    })
});

router.put('/:id', validateUserId, (req, res) => {
  const updatedUser = req.body;
  const { id } = req.params;
  if(!updatedUser.name) {
    res.status(400).json({ error: 'Please provide a name for the user.'});
  }

  db.update(id, updatedUser)
    .then( user => {
       res.status(204).json({ user })
    })
    .catch( err => {
       res.status(500).json({ message: 'error' });
     })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;

  db.getById(id)
    .then( user => {
      if(user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "User not found: Invalid ID." })
      }
    })
    .catch( err => {
      res.status(500).json({ message: 'Failed to process request.'})
    })
};

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
