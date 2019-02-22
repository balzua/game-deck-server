'use strict';
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Library} = require('./models');
const {GB_API_KEY} = require('../config');

const router = express.Router();

//Fetches a specific user's library.
router.get('/:user', (req, res) => {
    Library.findOne({user: req.params.user})
    .then(library => {
      //Check if the requested user's library is private. Only send the library if it is, or if the user matches the logged-in user.
      if (!library.private || (library.private && library.user === req.user)) {
        return res.status(200).json(library);
      } else {
        //Todo: improve error message.
        return res.status(401).json({
          code: 401,
          reason: 'AuthorizationError',
          message: 'That library is private and does not belong to you'
        });
      }
    });
});

router.put('/:user', jsonParser, (req, res) => {
  const editableFields = ['platforms', 'private'];
  if (req.params.user !== req.user.username) {
    return res.status(403).json({
      code: 403,
      reason: 'AuthorizationError',
      message: 'You are not allowed to edit games for that user'
    });
  }
  let updated = {};
  editableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field]
    }
  });
  Library.findOneAndUpdate({user: req.user.username}, updated, {new: true})
  .then(updated => res.status(204).end());
});

module.exports = {router};

