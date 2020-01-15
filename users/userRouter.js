const express = require('express');

const router = express.Router();

const users = require('./userDb');

const posts = require('../posts/postDb');

// POST -- Add user to the user database

router.post('/', (req, res) => {
  users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      errorMessage: 'This user could not be saved to the database'
    });
  });
});

// POST - Add a post to a user specified by the ID passed in the request body

router.post('/:id/posts', (req, res) => {
  const postInfo = req.body;
  const {text, user_id} = postInfo
  posts.insert(postInfo)
  .then(post => {
    if (!user_id) {
      res.status(404).json({
        errorMessage: 'The user with the specified ID does not exist.'
      })
    }
    else if (!text) {
      res.status(400).json({
        errorMessage: 'Please provide text for the comment.'
      })
    }
    else if (text && user_id) {
      res.status(201).json(post)
    }
    else {
      res.status(500).json({
        errorMessage: 'There was an error while saving the comment to the database'
      })
    }
  });
});

// GET - Get a list of users from the user database returned as an array

router.get('/', (req, res) => {
  users.get()
  .then(user => {
    res.status(200).json(user)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      errorMessage: 'The users could not be retrieved.'
    });
  });
});

// GET - Get a user 

router.get('/:id', (req, res) => {
  const id = req.params.id
  users.getById(id)
  .then(user => {
    if (!id) {
      res.status(404).json({
        errorMessage: 'The user with the specified ID does not exist.'
      })
    }
    else if (id) {
      res.status(200).json(user)
    }
    else {
      res.status(500).json({
        errorMessage: 'The user information could not be retrieved'
      })
    }
  });
});

// GET - Get a post by the specified ID passed into the request body.

router.get('/:id/posts', (req, res) => {
  const id = req.params.id
  posts.getById(id) 
  .then(post => {
    if (!id) {
      res.status(404).json({
        errorMessage: 'The post with the specified ID does not exist.'
      })
    }
    else if (id) {
      res.status(200).json(post)
    }
    else {
      res.status(500).json({
        errorMessage: 'The post information could not be retrieved.'
      })
    }
  });
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
