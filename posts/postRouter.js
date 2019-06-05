const express = require('express');
const postDb = require('./postDb.js');

const router = express.Router();

router.get('/', (req, res) => {

  postDb.get()
    .then( posts => {
      res.status(200).json({ posts });
    })
    .catch( err => {
      res.status(500).json({ error: "The posts information could not be retrieved." })
    })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json( req.post );
});

router.delete('/:id', validatePostId, (req, res) => {
  const { id } = req.params;

  postDb.remove(id)
    .then( post => {
      res.status(204).json({ post })
    })
    .catch( err => {
      res.status(500).json({ message: 'error' });
    })
});

router.put('/:id', validatePostId, (req, res) => {
  const updatedPost = req.body;
  const { id } = req.params;
  if(!updatedPost.text) {
    res.status(400).json({ message: 'Missing required text field.' })
  }

  postDb.update(id, updatedPost)
    .then( post => {
      res.status(204).json({ post });
    })
    .catch( err => {
      res.status(500).json ({ message: 'err'})
    })
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;

  postDb.getById(id)
    .then( post => {
      if(post) {
        req.post = post;
        next();
      } else {
        res.status(404).json({ message: "Post not found: Invalid ID." })
      }
    })
    .catch( err => {
      res.status(500).json({ message: 'Failed to process request.'})
    })
};

module.exports = router;