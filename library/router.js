'use strict';
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Library} = require('./models');
const {GB_API_KEY} = require('../config');

const router = express.Router();

router.get('/games/search/:query', (req, res) => {
    console.log('games route');
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


module.exports = {router};

