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
  .catch(error => {
    console.log(error);
    res.status(500).json({
      errorMessage: 'This user could not be saved to the database'
    });
  });
});

// POST - Add a post to a user specified by the ID passed in the request body

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
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

router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id
  console.log(req.user)
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

router.get('/:id/posts', validateUserId, (req, res) => {
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

// DELETE - Removes a user from the user database by specifying a user ID in the request body.

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  users.remove(id)
  .then(user => {
    if (!id) {
      res.status(404).json({
        errorMessage: 'The user with the specified ID could not be found'
      })
    }
    else if (id) {
      res.status(200).json(user)
    }
    else {
      res.status(500).json({
        errorMessage: 'The user could not be removed'
      })
    }
  });
});

// PUT - Updates a user in the user database by specifying a user ID passed in the request body.

router.put('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body
  users.update(id, updatedUser)
  .then(user => {
    if (id) {
      res.status(200).json(user)
    }
    else if (!id) {
      res.status(404).json({
        errorMessage: 'The user with that ID could not be found.'
      })
    }
    else {
      res.status(500).json({
        errorMessage: 'The user could not be updated.'
      })
    }
  });
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id
  if (id) {
    req.user = id
    next();
  }
  else {
    res.status(400).json({
      message: 'Invalid user ID'
    })
  }
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
  if (!req.body) {
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
