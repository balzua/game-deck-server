'use strict';
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Game} = require('./models');
const {Library} = require('../library');
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
    // Extract only the guid and name from the response object array
    .then(gbResponse => {
      const results = gbResponse.data.results.map(result => ({
            label: result.name,
            value: result.guid
        }));
      return results;
    })
    .then(results => res.status(200).json(results))
    .catch(function (error) {
        console.log(error);
    });
});

router.post('/', jsonParser, (req, res) => {
  console.log(req.body);
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
    return Game.create(game);
  })
  .then(game => {
    return Library.findOneAndUpdate({user: req.user.username}, {$push: {games: game._id}});
  })
  .then(() => res.status(201).send());
  };
}); 

router.put('/:id', jsonParser, (req, res) => {
  const editableFields = ['userRating', 'libraryStatus', 'favorite']
  console.log(req.body);
  if (req.body.id != req.params.id) {
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
  Game.findOneAndUpdate({user: req.user.username, id: req.body.id}, updated, {new: true})
  .then(updated => res.status(204).end());
});

router.delete('/:id', (req, res) => {
  Game.findOneAndDelete({id: req.params.id, user: req.user.username})
  .then(() => res.status(204).end());
});

module.exports = {router};

