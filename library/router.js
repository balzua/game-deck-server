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
    .populate({
      'path': 'games',
      'match': {user: req.params.user}
    })
    .then(library => {
      //Check if the requested user's library is private. Only send the library if it is, or if the user matches the logged-in user.
      if (library.user === req.user.username) {
        if (req.query.content === 'games') {
          return res.status(200).json(library.serialize().games);
        }
        else if (req.query.content === 'stats') {
          return res.status(200).json(library.serialize().chartScores);
        }
        else {
          return res.status(200).json(library.serialize());
        }
      } else {
        //Todo: improve error message.
        return res.status(401).json({
          code: 401,
          reason: 'AuthorizationError',
          message: 'That library is private and does not belong to you.'
        });
      }
    })
    .catch(err => {
      return res.status(500).json({
        code: 500,
        reason: 'ServerError',
        message: 'An Internal Server Error occurred, please try again later.'
      })
    });
});

module.exports = {router};

