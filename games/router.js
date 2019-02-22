'use strict';
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Game} = require('./models');
const {GB_API_KEY} = require('../config');

const router = express.Router();

router.get('/search/', (req, res) => {
    axios.get('https://www.giantbomb.com/api/search/', {
        params: {
            query: req.query,
            format: 'json',
            resources: 'game',
            api_key: GB_API_KEY
        }
    })
    // Prevent requests from going too fast by imposing a 1s wait time
    .then(gbResponse => new Promise(resolve => setTimeout(() => resolve(gbResponse), 1000)))
    // Extract only the guid and name from the response object array
    .then(gbResponse => {
      const results = gbResponse.data.results.map(result => ({
            name: result.name,
            guid: result.guid
        }));
      return results;
    })
    .then(results => res.status(200).json(results))
    .catch(function (error) {
        console.log(error);
    });
});

router.post('/', jsonParser, (req, res) => {
  console.log(req.user);
  if (!req.body.guid) {
    return res.status(422).json({
      code: 422,
      reason: 'RequestError',
      message: 'An ID is required to add games'
    });
  }
  for (let i = 0; i < req.body.guid.length; i++) {
    axios.get(`https://www.giantbomb.com/api/game/${req.body.guid[i]}`, {
    params: {
      api_key: GB_API_KEY,
      format: 'json'
    }
  })
  .then(gbResponse => ({
    id: req.body.guid[i],
    name: gbResponse.data.results.name,
    description: gbResponse.data.results.deck,
    image: gbResponse.data.results.image.small_url,
    genres: gbResponse.data.results.genres.map(genre => genre.name),
    releaseDate: gbResponse.data.results.original_release_date,
    platforms: gbResponse.data.results.platforms.map(platform => platform.abbreviation),
    user: req.user.username
  }))
  .then(game => {
    return Game.create(game)
  })
  .then(() => res.status(201).send());
  };
}); 

router.put('/:id', jsonParser, (req, res) => {
  const editableFields = ['rating', 'libraryStatus', 'favorite']
  if (req.body.user !== req.user.username) {
    return res.status(403).json({
      code: 403,
      reason: 'AuthorizationError',
      message: 'You are not allowed to edit games for that user'
    });
  }
  if (req.body.id !== req.params.id) {
    return res.status(400).json({
      code: 400,
      reason: 'ValidationError',
      message: 'The request body ID and url ID must match'
    });
  }
  let updated = {};
  editableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field]
    }
  });
  Game.findOneAndUpdate({user: req.user.username, _id: req.body.id}, updated, {new: true})
  .then(updated => res.status(204).end());
});

router.delete('/:id', (req, res) => {
  Game.findOneAndDelete({_id: req.params.id, user: req.user.username})
  .then(() => res.status(204).end());
});

module.exports = {router};

