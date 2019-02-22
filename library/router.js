'use strict';
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Library, Game} = require('./models');
const {GB_API_KEY} = require('../config');

const router = express.Router();

router.get('/games/search/:query', (req, res) => {
    axios.get('https://www.giantbomb.com/api/search/', {
        params: {
            query: req.params.query,
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

router.get('/:user', (req, res) => {
    console.log('users route');
    Library.findOne({user: req.params.user})
    .then(library => res.status(200).send(library))
    .catch(err => res.status(404).send({
        reason: 'NotFoundError',
        message: 'Library Not Found',
        user: req.params.user
    }));
});

router.post('/:user/games', jsonParser, (req, res) => {
  if (!req.body.guid) {
    return res.status(422).json({
      code: 422,
      reason: 'RequestError',
      message: 'An ID is required to add games'
    });
  }
  axios.get(`https://www.giantbomb.com/api/game/${req.body.guid}`, {
    params: {
      api_key: GB_API_KEY,
      format: 'json'
    }
  })
  .then(gbResponse => ({
    id: req.body.guid,
    name: gbResponse.data.results.name,
    description: gbResponse.data.results.deck,
    image: gbResponse.data.results.image.small_url,
    genres: gbResponse.data.results.genres.map(genre => genre.name),
    //Todo: Releasedate
    platforms: gbResponse.data.results.platforms.map(platform => platform.abbreviation)
  }))
  .then(game => {
    return Game.create(game)
  })
  .then(() => res.status(201).send());
}); 

module.exports = {router};

