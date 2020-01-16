const express = require('express');

const router = express.Router();

const users = require('./userDb');

const posts = require('../posts/postDb');

// POST -- Add user to the user database

router.post('/', validateUser, (req, res) => {
  users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  });

// POST - Add a post to a user specified by the ID passed in the request body

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  posts.insert(req.body)
  .then(post => {
    res.status(201).json(post)
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

router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id
  console.log(req.user)
  users.getById(id)
  .then(user => {
    res.status(200).json(user)
  });
});

// GET - Get a post by the specified ID passed into the request body.

router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id
  users.getUserPosts(id) 
  .then(post => {
    res.status(200).json(post)
  });
});

// DELETE - Removes a user from the user database by specifying a user ID in the request body.

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  users.remove(id)
  .then(user => {
    res.status(204).json(user)
  });
});

// PUT - Updates a user in the user database by specifying a user ID passed in the request body.

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body
  users.update(id, updatedUser)
  .then(user => {
    res.status(200).json(user)
  });
});

//custom middleware

function validateUserId(req, res, next) {
  users.getById(req.params.id)
  .then(user => {
    if (user) {
      req.user = user
      next();
    }
    else {
      res.status(400).json({
        message: 'Invalid user ID'
      })
    }
  });
};

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      message: 'Missing user data.'
    })
  }
  else if (!req.body.name) {
    res.status(400).json({
      message: 'Missing required name field.'
    })
  }
  else {
    next();
  }
};

function validatePost(req, res, next) {
  if (!req.body && !req.body.text) {
    res.status(400).json({
      message: 'Missing post Data.'
    })
  }
  else if (!req.body.text) {
    res.status(400).json({
      message: 'Missing required text field.'
    })
  }
  else {
    next();
  }
};

module.exports = router;
