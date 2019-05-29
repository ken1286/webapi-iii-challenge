const express = require('express');
const userDb = require('./userDb.js');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  const newUser = req.body;

  userDb.insert(newUser)
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

  userDb.get()
    .then( users => {
      res.status(200).json({ users });
    })
    .catch( err => {
      res.status(500).json({ error: "The users information could not be retrieved." })
    })
});

router.get('/:id', validateUserId, (req, res) => {

  res.status(200).json( req.user )
  // userDb.getById(id)
  //   .then( user => {
  //       res.status(200).json({ user });
  //     })
  //   .catch( err => {
  //     res.status(500).json({ error: "The user information could not be retrieved." });
  //   })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;

  userDb.getUserPosts(id)
    .then( posts => {
      res.status(200).json({ posts });
    })
    .catch(err => {
      res.status(500).json({ error: 'The user posts could not be retrieved'});
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params;

  userDb.remove(id)
    .then( user => {
      res.status(204).json({ user })
    })
    .catch( err => {
       res.status(500).json({ message: 'error' });
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const updatedUser = req.body;
  const { id } = req.params;
  console.log(updatedUser);
  console.log(id);

  userDb.update(id, updatedUser)
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

  userDb.getById(id)
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
  const { name } = req.body;
  if(name) {
    next();
  } else {
    res.status(400).json({ message: 'Missing required name field.' })
  }
};

function validatePost(req, res, next) {

};

module.exports = router;
