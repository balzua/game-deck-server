'use strict';
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Library = require('./models');
const {GB_API_KEY} = require('../config');

const router = express.Router();

router.get('/:user', (req, res) => {
    Library.findOne({user: req.params.user})
    .then(library => res.status(200).send(library))
    .catch(err => res.status(404).send({
        reason: 'NotFoundError',
        message: 'Library Not Found',
        user: req.params.user
    }));
});

router.get('/games/:query', (req, res) => {
    axios.get('https://www.giantbomb.com/api/search/', {
        params: {
            query: req.params.query,
            format: 'json',
            resources: 'game',
            api_key: GB_API_KEY
        }
    })
    .then(gbResponse => {
        const results = gbResponse.results.map(result => ({
            name: result.name,
            guid: result.guid
        }));
    })
    .catch(function (error) {
        console.log(error);
    });
});

module.exports = {router};

